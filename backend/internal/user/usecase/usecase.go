package usecase

import (
	"context"

	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/user"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type userUC struct {
	cfg      *config.Config
	userRepo user.Repository
	log      logger.Logger
}

func NewUserUC(
	cfg *config.Config, userRepo user.Repository, log logger.Logger,
) user.UseCase {
	return &userUC{
		cfg:      cfg,
		userRepo: userRepo,
		log:      log,
	}
}

func (u *userUC) FollowToUser(
	ctx context.Context, follow *models.UserFollow,
) (*models.UserFollow, error) {
	user, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(
			errors.WithMessage(err, "userUC.FollowToUser.GetUserFromCtx"),
		)
	}

	follow.UserID = user.ID
	if err := utils.ValidateStruct(ctx, follow); err != nil {
		return nil, httpErrors.NewBadRequestError(
			errors.WithMessage(err, "userUC.FollowToUser.ValidateStruct"),
		)
	}

	f, err := u.userRepo.FollowToUser(ctx, follow)
	if err != nil {
		return nil, err
	}

	return f, nil
}

func (u *userUC) UnfollowUser(
	ctx context.Context, follow *models.UserFollow,
) error {
	user, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return httpErrors.NewUnauthorizedError(
			errors.WithMessage(err, "userUC.FollowToUser.GetUserFromCtx"),
		)
	}

	follow.UserID = user.ID
	if err := utils.ValidateStruct(ctx, follow); err != nil {
		return httpErrors.NewBadRequestError(
			errors.WithMessage(err, "userUC.FollowToUser.ValidateStruct"),
		)
	}

	if err := u.userRepo.UnfollowUser(ctx, follow); err != nil {
		return err
	}

	return nil
}

func (u *userUC) UpdateNotification(
	ctx context.Context, follow *models.UserFollow,
) (*models.UserFollow, error) {
	user, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(
			errors.WithMessage(err, "userUC.FollowToUser.GetUserFromCtx"),
		)
	}

	follow.UserID = user.ID
	if err := utils.ValidateStruct(ctx, follow); err != nil {
		return nil, httpErrors.NewBadRequestError(
			errors.WithMessage(err, "userUC.FollowToUser.ValidateStruct"),
		)
	}

	f, err := u.userRepo.UpdateNotification(ctx, follow)
	if err != nil {
		return nil, err
	}

	return f, nil
}
