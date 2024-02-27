package post

import (
	"context"
	"github.com/studsch/cool-app/backend/internal/models"
)

// Repository Post repository interface
type Repository interface {
	Create(ctx context.Context, post *models.Post) (*models.Post, error)
}
