package like

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
)

type Repository interface {
	LikePost(ctx context.Context, like *models.LikePost) (*models.LikePost, error)
	UnlikePost(ctx context.Context, like *models.LikePost) error
	GetPostLikeCount(ctx context.Context, postID uuid.UUID) (uint, error)

	LikeComment(ctx context.Context, like *models.LikeComment) (*models.LikeComment, error)
	UnlikeComment(ctx context.Context, like *models.LikeComment) error
}
