package usecase

import (
	"context"
	"net/http"

	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/comment"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
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

// Delete Deletes comment
func (u *commentUC) Delete(ctx context.Context, commentID uuid.UUID) error {
	postByID, err := u.commentRepo.GetByID(ctx, commentID)
	if err != nil {
		return err
	}

	if err = utils.ValidateIsOwner(ctx, postByID.UserID.String(), u.logger); err != nil {
		return httpErrors.NewRestError(http.StatusForbidden, "Forbidden", errors.Wrap(err, "commentUC.Delete.ValidateIsOwner"))
	}

	if err := u.commentRepo.Delete(ctx, commentID); err != nil {
		return err
	}

	return nil
}

func (u *commentUC) GetByID(ctx context.Context, commentID uuid.UUID) (*models.CommentBase, error) {
	return u.commentRepo.GetByID(ctx, commentID)
}

func (u *commentUC) GetAllByPostID(ctx context.Context, postID uuid.UUID, pq *utils.PaginationQuery) (*models.CommentList, error) {
	return u.commentRepo.GetAllByPostID(ctx, postID, pq)
}

func (u *commentUC) GetReplyByCommentID(ctx context.Context, commentID uuid.UUID, pq *utils.PaginationQuery) (*models.CommentList, error) {
	return u.commentRepo.GetReplyByCommentID(ctx, commentID, pq)
}

func (u *commentUC) GetCommentCountByPostID(
	ctx context.Context, postID uuid.UUID,
) (int, error) {
	return u.commentRepo.GetCommentCountByPostID(ctx, postID)
}

func (u *commentUC) GetReplyCountByCommentID(
	ctx context.Context, postID uuid.UUID,
) (int, error) {
	return u.commentRepo.GetReplyCountByCommentID(ctx, postID)
}

func (u *commentUC) GetAllReplysByMainCommentID(
	ctx context.Context, mainCommentID uuid.UUID, pq *utils.PaginationQuery,
) (*models.CommentList, error) {
	return u.commentRepo.GetAllReplysByMainCommentID(ctx, mainCommentID, pq)
}
