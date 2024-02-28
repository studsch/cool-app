package usecase

import (
	"context"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/post"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
	"net/http"
)

// postUC Post useCase
type postUC struct {
	cfg      *config.Config
	postRepo post.Repository
	logger   logger.Logger
}

// NewPostUC Post useCase constructor
func NewPostUC(cfg *config.Config, postRepo post.Repository, logger logger.Logger) post.UseCase {
	return &postUC{
		cfg:      cfg,
		postRepo: postRepo,
		logger:   logger,
	}
}

// Create Creates new post
func (u *postUC) Create(ctx context.Context, post *models.Post) (*models.Post, error) {
	user, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(errors.WithMessage(err, "postUC.Create.GetUserFromCtx"))
	}

	post.UserID = user.ID

	if err := utils.ValidateStruct(ctx, post); err != nil {
		return nil, httpErrors.NewBadRequestError(errors.WithMessage(err, "postUC.Create.ValidateStruct"))
	}

	p, err := u.postRepo.Create(ctx, post)
	if err != nil {
		return nil, err
	}

	return p, nil
}

// Update Updates post
func (u *postUC) Update(ctx context.Context, post *models.Post) (*models.Post, error) {
	postByID, err := u.postRepo.GetByID(ctx, post.ID)
	if err != nil {
		return nil, err
	}

	if err = utils.ValidateIsOwner(ctx, postByID.UserID.String(), u.logger); err != nil {
		return nil, httpErrors.NewRestError(http.StatusForbidden, "Forbidden", errors.Wrap(err, "postUC.Update.ValidateIsOwner"))
	}

	updatedPost, err := u.postRepo.Update(ctx, post)
	if err != nil {
		return nil, err
	}

	return updatedPost, nil
}

// Archive Archives post
func (u *postUC) Archive(ctx context.Context, postID uuid.UUID) error {
	postByID, err := u.postRepo.GetByID(ctx, postID)
	if err != nil {
		return err
	}

	if err = utils.ValidateIsOwner(ctx, postByID.UserID.String(), u.logger); err != nil {
		return httpErrors.NewRestError(http.StatusForbidden, "Forbidden", errors.Wrap(err, "postUC.Archive.ValidateIsOwner"))
	}

	if err := u.postRepo.Archive(ctx, postID); err != nil {
		return err
	}

	return nil
}

// Delete Deletes post
func (u *postUC) Delete(ctx context.Context, postID uuid.UUID) error {
	postByID, err := u.postRepo.GetByID(ctx, postID)
	if err != nil {
		return err
	}

	if err = utils.ValidateIsOwner(ctx, postByID.UserID.String(), u.logger); err != nil {
		return httpErrors.NewRestError(http.StatusForbidden, "Forbidden", errors.Wrap(err, "postUC.Delete.ValidateIsOwner"))
	}

	if err := u.postRepo.Delete(ctx, postID); err != nil {
		return err
	}

	return nil
}

// GetPosts Get all posts
func (u *postUC) GetPosts(ctx context.Context, pq *utils.PaginationQuery) (*models.PostList, error) {
	return u.postRepo.GetPosts(ctx, pq)
}
