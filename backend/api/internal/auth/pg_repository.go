package auth

import (
	"context"
	"github.com/studsch/cool-app/backend/internal/models"
)

// Repository Auth repository interface
type Repository interface {
	Register(ctx context.Context, user *models.User) (*models.User, error)
}
