package post

import (
	"context"
	"github.com/studsch/cool-app/backend/internal/models"
)

// UseCase Post repository interface
type UseCase interface {
	Create(ctx context.Context, post *models.Post) (*models.Post, error)
}
