package user

import (
	"context"

	"github.com/google/uuid"

	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
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
	SearchByFilter(
		ctx context.Context, filter *models.UserFilter,
		pq *utils.PaginationQuery,
	) (*models.UserList, error)
	GetRecommendedUsersIDs(
		ctx context.Context, userID uuid.UUID,
	) (*[]*models.UserFollow, error)
	GetFriendsIDs(
		ctx context.Context, userID uuid.UUID,
	) (*[]*uuid.UUID, error)
	GetMiniUsersByID(
		ctx context.Context, userID uuid.UUID,
	) (*models.MiniUser, error)
	CheckSubscribeExists(
		ctx context.Context, userID uuid.UUID, toUserID uuid.UUID,
	) (bool, error)
	CheckUserWithPhoneExists(
		ctx context.Context, phone string,
	) (bool, error)
	CheckUserWithLoginExists(
		ctx context.Context, login string,
	) (bool, error)
	GetUserByLogin(ctx context.Context, login string) (*models.User, error)
	GetPostsCountByUserID(ctx context.Context, userID uuid.UUID) (uint, error)
}
