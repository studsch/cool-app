package post

import (
	"context"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
)

// UseCase Post repository interface
type UseCase interface {
	Create(ctx context.Context, post *models.Post) (*models.Post, error)
	Update(ctx context.Context, post *models.Post) (*models.Post, error)
	Archive(ctx context.Context, postID uuid.UUID) error
	Delete(ctx context.Context, postID uuid.UUID) error
}
