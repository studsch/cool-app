package user

import (
	"context"

	"github.com/studsch/cool-app/backend/internal/models"
)

type Repository interface {
	FollowToUser(ctx context.Context, follow *models.UserFollow) (*models.UserFollow, error)
	UnfollowUser(ctx context.Context, follow *models.UserFollow) error
	UpdateNotification(ctx context.Context, follow *models.UserFollow) (*models.UserFollow, error)
}
