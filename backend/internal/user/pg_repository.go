package user

import (
	"context"

	"github.com/google/uuid"

	"github.com/studsch/cool-app/backend/internal/models"
)

type Repository interface {
	FollowToUser(
		ctx context.Context, follow *models.UserFollow,
	) (*models.UserFollow, error)
	UnfollowUser(ctx context.Context, follow *models.UserFollow) error
	UpdateNotification(
		ctx context.Context, follow *models.UserFollow,
	) (*models.UserFollow, error)
	GetUserSubscribersCount(
		ctx context.Context, userID uuid.UUID,
	) (uint, error)
	GetUserSubscriptionsCount(
		ctx context.Context, userID uuid.UUID,
	) (uint, error)
	GetSubscriptionsUserIDs(
		ctx context.Context, userID uuid.UUID,
	) (*[]uuid.UUID, error)
	GetUsersInfoByIDs(
		ctx context.Context, userIDs *[]uuid.UUID,
	) (*[]*models.User, error)
	GetSubscriptionsByUserID(
		ctx context.Context, userID uuid.UUID,
	) (*[]*models.User, error)
}
