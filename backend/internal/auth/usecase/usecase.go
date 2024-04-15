package usecase

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

const (
	cacheDuration = 7 * 24 * 60 * 60
)

// authUC Auth useCase
type authUC struct {
	cfg       *config.Config
	authRepo  auth.Repository
	awsRepo   auth.AWSRepository
	logger    logger.Logger
	redisRepo auth.RedisRepository
}

func (u *authUC) SearchByFilter(ctx context.Context, filter *models.UserFilter, pq *utils.PaginationQuery) (*models.UserList, error) {
	return u.authRepo.SearchByFilter(ctx, filter, pq)
}

// Search implements auth.UseCase.
func (u *authUC) Search(ctx context.Context, q string, pq *utils.PaginationQuery) (*models.UserList, error) {
	return u.authRepo.Search(ctx, q, pq)
}

// NewAuthUC Auth useCase constructor
func NewAuthUC(
	cfg *config.Config, authRepo auth.Repository, logger logger.Logger,
	awsRepo auth.AWSRepository, redisRepo auth.RedisRepository,
) auth.UseCase {
	return &authUC{
		cfg:       cfg,
		authRepo:  authRepo,
		awsRepo:   awsRepo,
		logger:    logger,
		redisRepo: redisRepo,
	}
}

// Register Create new user
func (u *authUC) Register(ctx context.Context, user *models.User) (*models.UserWithTokens, error) {
	existsUserLogin, err := u.authRepo.FindByLogin(ctx, user)
	if existsUserLogin != nil || err == nil {
		return nil, httpErrors.NewRestErrorWithMessage(http.StatusBadRequest, httpErrors.ErrLoginAlreadyExists, nil)
	}

	existsUserPhoneNumber, err := u.authRepo.FindByPhoneNumber(ctx, user)
	if existsUserPhoneNumber != nil || err == nil {
		return nil, httpErrors.NewRestErrorWithMessage(http.StatusBadRequest, httpErrors.ErrPhoneNumberAlreadyExists, nil)
	}

	if err := user.PrepareCreate(); err != nil {
		return nil, httpErrors.NewBadRequestError(errors.Wrap(err, "authUC.Register.PrepareCreate"))
	}

	createdUser, err := u.authRepo.Register(ctx, user)
	if err != nil {
		return nil, err
	}
	createdUser.SanitizePassword()

	tokens, err := utils.GenerateJWTTokens(createdUser, u.cfg)
	if err != nil {
		return nil, httpErrors.NewInternalServerError(errors.Wrap(err, "authUC.Register.GenerateJWTToken"))
	}

	if err = u.redisRepo.SetRefreshToken(
		ctx, createdUser.ID.String(), tokens.Refresh, cacheDuration,
	); err != nil {
		u.logger.Errorf("authUC.Register.SetRefreshToken: %v", err)
	}

	return &models.UserWithTokens{
		User:         createdUser,
		AccessToken:  tokens.Access,
		RefreshToken: tokens.Refresh,
	}, nil
}

// GetByID Get user by id
func (u *authUC) GetByID(ctx context.Context, userID uuid.UUID) (*models.User, error) {
	user, err := u.authRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	user.SanitizePassword()

	return user, nil
}

// Login Log-in user
func (u *authUC) Login(ctx context.Context, user *models.User) (*models.UserWithTokens, error) {
	var foundUser *models.User
	var err error

	if user.Login != "" {
		foundUser, err = u.authRepo.FindByLogin(ctx, user)
		if err != nil {
			return nil, err
		}
	} else if user.PhoneNumber != nil {
		foundUser, err = u.authRepo.FindByPhoneNumber(ctx, user)
		if err != nil {
			return nil, err
		}
	} else if user.Login == "" && user.PhoneNumber == nil {
		return nil, httpErrors.NewBadRequestError("login and phone number is empty")
	}

	if err := foundUser.ComparePasswords(user.Password); err != nil {
		return nil, httpErrors.NewUnauthorizedError(errors.Wrap(err, "authUC.Login.ComparePasswords"))
	}

	foundUser.SanitizePassword()

	tokens, err := utils.GenerateJWTTokens(foundUser, u.cfg)
	if err != nil {
		return nil, httpErrors.NewInternalServerError(errors.Wrap(err, "authUC.Login.GenerateJWTToken"))
	}

	if err = u.redisRepo.SetRefreshToken(
		ctx, foundUser.ID.String(), tokens.Refresh, cacheDuration,
	); err != nil {
		u.logger.Errorf("authUC.Login.SetRefreshToken: %v", err)
	}

	return &models.UserWithTokens{
		User:         foundUser,
		AccessToken:  tokens.Access,
		RefreshToken: tokens.Refresh,
	}, nil
}

func (u *authUC) UploadAvatar(ctx context.Context, userID uuid.UUID, file models.UploadInput) (*models.User, error) {
	uploadInfo, err := u.awsRepo.PutObject(ctx, file)
	if err != nil {
		return nil, httpErrors.NewInternalServerError(errors.Wrap(err, "authUC.UploadAvatar.PutObject"))
	}

	avatarURL := u.generateAWSMinioURL(file.BucketName, uploadInfo.Key)

	updatedUser, err := u.authRepo.Update(ctx, &models.User{
		ID:     userID,
		Avatar: &avatarURL,
	})
	if err != nil {
		return nil, err
	}

	updatedUser.SanitizePassword()

	return updatedUser, nil
}

func (u *authUC) generateAWSMinioURL(bucket string, key string) string {
	url, err := u.awsRepo.GenerateAWSMinioURL(context.Background(), bucket, key)
	if err != nil {
		return ""
	}
	fmt.Println("Generated presigned URL", url)

	return fmt.Sprintf("%s/%s/%s", u.cfg.AWS.MinioEndpoint, bucket, key)
}

func (u *authUC) Update(ctx context.Context, user *models.User) (*models.User, error) {
	updatedUser, err := u.authRepo.Update(ctx, user)
	if err != nil {
		return nil, err
	}

	updatedUser.SanitizePassword()

	return updatedUser, nil
}

func (u *authUC) Logout(ctx context.Context, userID string) error {
	if err := u.redisRepo.DeleteRefreshToken(ctx, userID); err != nil {
		u.logger.Errorf("authUC.Logout.DeleteRefreshToken: %v", err)
	}

	return nil
}

func (u *authUC) RenewTokens(
	ctx context.Context, inRefreshToken string,
) (*models.UserWithTokens, error) {
	userCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(
			errors.WithMessage(
				err, "postUC.Create.GetUserFromCtx",
			),
		)
	}

	refreshToken, err := u.redisRepo.GetRefreshTokenByID(ctx, userCtx.ID.String())
	if err != nil {
		return nil, fmt.Errorf("not valid refresh token")
	}

	if inRefreshToken != *refreshToken {
		return nil, fmt.Errorf("not valid refresh token")
	}

	expiresRefreshToken, err := utils.ParseRefreshToken(inRefreshToken)
	if err != nil {
		return nil, err
	}

	now := time.Now().Unix()
	if now >= expiresRefreshToken {
		return nil, fmt.Errorf("refresh token is expire")
	}

	tokens, err := utils.GenerateJWTTokens(userCtx, u.cfg)
	if err != nil {
		return nil, httpErrors.NewInternalServerError(errors.Wrap(err, "authUC.Register.GenerateJWTToken"))
	}

	if err = u.redisRepo.SetRefreshToken(
		ctx, userCtx.ID.String(), tokens.Refresh, cacheDuration,
	); err != nil {
		u.logger.Errorf("authUC.Register.SetRefreshToken: %v", err)
	}

	return &models.UserWithTokens{
		User:         userCtx,
		AccessToken:  tokens.Access,
		RefreshToken: tokens.Refresh,
	}, nil
}
