package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/like"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type likeUC struct {
	cfg      *config.Config
	likeRepo like.Repository
	log      logger.Logger
}

// GetPostLikeCount implements like.UseCase.
func (u *likeUC) GetPostLikeCount(ctx context.Context, postID uuid.UUID) (uint, error) {
	return u.likeRepo.GetPostLikeCount(ctx, postID)
}

// LikeComment implements like.UseCase.
func (u *likeUC) LikeComment(ctx context.Context, like *models.LikeComment) (*models.LikeComment, error) {
	user, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(errors.WithMessage(err, "likeUC.LikeComment.GetUserFromCtx"))
	}

	like.UserID = user.ID

	if err := utils.ValidateStruct(ctx, like); err != nil {
		return nil, httpErrors.NewBadRequestError(errors.WithMessage(err, "likeUC.LikeComment.ValidateStruct"))
	}

	l, err := u.likeRepo.LikeComment(ctx, like)
	if err != nil {
		return nil, err
	}

	return l, nil
}

// LikePost implements like.UseCase.
func (u *likeUC) LikePost(ctx context.Context, like *models.LikePost) (*models.LikePost, error) {
	user, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(errors.WithMessage(err, "likeUC.LikePost.GetUserFromCtx"))
	}

	like.UserID = user.ID

	if err := utils.ValidateStruct(ctx, like); err != nil {
		return nil, httpErrors.NewBadRequestError(errors.WithMessage(err, "likeUC.LikePost.ValidateStruct"))
	}

	l, err := u.likeRepo.LikePost(ctx, like)
	if err != nil {
		return nil, err
	}

	return l, nil
}

// UnlikeComment implements like.UseCase.
func (u *likeUC) UnlikeComment(ctx context.Context, like *models.LikeComment) error {
	user, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return httpErrors.NewUnauthorizedError(errors.WithMessage(err, "likeUC.UnlikeComment.GetUserFromCtx"))
	}

	like.UserID = user.ID

	if err := utils.ValidateStruct(ctx, like); err != nil {
		return httpErrors.NewBadRequestError(errors.WithMessage(err, "likeUC.UnlikeComment.ValidateStruct"))
	}

	if err := u.likeRepo.UnlikeComment(ctx, like); err != nil {
		return err
	}

	return nil
}

// UnlikePost implements like.UseCase.
func (u *likeUC) UnlikePost(ctx context.Context, like *models.LikePost) error {
	user, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return httpErrors.NewUnauthorizedError(errors.WithMessage(err, "likeUC.UnlikePost.GetUserFromCtx"))
	}

	like.UserID = user.ID

	if err := utils.ValidateStruct(ctx, like); err != nil {
		return httpErrors.NewBadRequestError(errors.WithMessage(err, "likeUC.UnlikePost.ValidateStruct"))
	}

	if err := u.likeRepo.UnlikePost(ctx, like); err != nil {
		return err
	}

	return nil
}

func NewLikeUC(cfg *config.Config, likeRepo like.Repository, log logger.Logger) like.UseCase {
	return &likeUC{
		cfg:      cfg,
		likeRepo: likeRepo,
		log:      log,
	}
}
