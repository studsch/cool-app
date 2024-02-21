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
func (u *authUC) Register(ctx context.Context, user *models.User) (*models.UserWithToken, error) {
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

	// TODO: tokens

	return &models.UserWithToken{
		User: createdUser,
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
