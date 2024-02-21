package usecase

import (
	"context"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
	"net/http"
)

// authUC Auth useCase
type authUC struct {
	cfg      *config.Config
	authRepo auth.Repository
	logger   logger.Logger
}

// NewAuthUC Auth useCase constructor
func NewAuthUC(cfg *config.Config, authRepo auth.Repository, logger logger.Logger) auth.UseCase {
	return &authUC{
		cfg:      cfg,
		authRepo: authRepo,
		logger:   logger,
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

	return &models.UserWithTokens{
		User:         createdUser,
		AccessToken:  tokens.Access,
		RefreshToken: tokens.Refresh,
	}, nil
}

func (u *authUC) GetByID(ctx context.Context, userID uuid.UUID) (*models.User, error) {
	user, err := u.authRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	user.SanitizePassword()

	return user, nil
}

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

	return &models.UserWithTokens{
		User:         foundUser,
		AccessToken:  tokens.Access,
		RefreshToken: tokens.Refresh,
	}, nil
}
