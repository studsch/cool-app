package usecase

import (
	"context"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/post"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
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
