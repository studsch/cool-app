package user

import (
	"context"

	"github.com/google/uuid"

	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
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
	SearchByFilter(
		ctx context.Context, filter *models.UserFilter,
		pq *utils.PaginationQuery,
	) (*models.UserList, error)
	GetRecommendedUsers(ctx context.Context) (*[]*models.RecUserList, error)
	GetFriends(ctx context.Context) (*[]*models.MiniUser, error)
}
