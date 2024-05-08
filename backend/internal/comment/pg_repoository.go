package comment

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// Repository Comment repository interface
type Repository interface {
	Create(ctx context.Context, comment *models.Comment) (*models.Comment, error)
	Delete(ctx context.Context, commentID uuid.UUID) error
	GetByID(ctx context.Context, commentID uuid.UUID) (*models.CommentBase, error)
	GetAllByPostID(
		ctx context.Context, postID uuid.UUID, pq *utils.PaginationQuery,
	) (*models.CommentList, error)
	GetReplyByCommentID(
		ctx context.Context, commentID uuid.UUID, pq *utils.PaginationQuery,
	) (*models.CommentList, error)
	GetCommentCountByPostID(
		ctx context.Context, postID uuid.UUID,
	) (int, error)
	GetReplyCountByCommentID(
		ctx context.Context, commentID uuid.UUID,
	) (int, error)
	GetAllReplysByMainCommentID(
		context.Context, uuid.UUID, *utils.PaginationQuery,
	) (*models.CommentList, error)
}
