package usecase

import (
	"context"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/comment"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// commentUC Comment useCase
type commentUC struct {
	cfg         *config.Config
	commentRepo comment.Repository
	logger      logger.Logger
}

// NewCommentUC Comment useCase constructor
func NewCommentUC(cfg *config.Config, commentRepo comment.Repository, logger logger.Logger) comment.UseCase {
	return &commentUC{
		cfg:         cfg,
		commentRepo: commentRepo,
		logger:      logger,
	}
}

// Create Creates new comment
func (u *commentUC) Create(ctx context.Context, comment *models.Comment) (*models.Comment, error) {
	return u.commentRepo.Create(ctx, comment)
}

func (u *commentUC) Delete(ctx context.Context, commentID uuid.UUID) error {
	//TODO implement me
	panic("implement me")
}

func (u *commentUC) GetByID(ctx context.Context, commentID uuid.UUID) (*models.CommentBase, error) {
	//TODO implement me
	panic("implement me")
}

func (u *commentUC) GetAllByPostID(ctx context.Context, postID uuid.UUID, pq *utils.PaginationQuery) (*models.CommentList, error) {
	//TODO implement me
	panic("implement me")
}

func (u *commentUC) GetReplyByCommentID(ctx context.Context, commentID uuid.UUID, pq *utils.PaginationQuery) {
	//TODO implement me
	panic("implement me")
}
