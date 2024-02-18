package auth

import (
	"context"
	"github.com/studsch/cool-app/backend/internal/models"
)

// UseCase Auth repository interface
type UseCase interface {
	Register(ctx context.Context, user *models.User) (*models.UserWithToken, error)
}
