package user

import (
	"context"

	"github.com/google/uuid"

	"github.com/studsch/cool-app/backend/internal/models"
)

type UseCase interface {
	FollowToUser(
		ctx context.Context, follow *models.UserFollow,
	) (*models.UserFollow, error)
	UnfollowUser(ctx context.Context, follow *models.UserFollow) error
	UpdateNotification(
		ctx context.Context, follow *models.UserFollow,
	) (*models.UserFollow, error)
	GetSubscriptions(
		ctx context.Context, userID uuid.UUID,
	) (*[]*models.User, error)
	GetUserSubscriptionsCount(
		ctx context.Context, userID uuid.UUID,
	) (uint, error)
	GetUserSubscribersCount(
		ctx context.Context, userID uuid.UUID,
	) (uint, error)
}
