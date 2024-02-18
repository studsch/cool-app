package usecase

import (
	"context"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
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
	// TODO: get exists users (login, phone)

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
