package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/pkg/errors"

	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/user"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type userUC struct {
	cfg      *config.Config
	userRepo user.Repository
	log      logger.Logger
}

func NewUserUC(
	cfg *config.Config, userRepo user.Repository, log logger.Logger,
) user.UseCase {
	return &userUC{
		cfg:      cfg,
		userRepo: userRepo,
		log:      log,
	}
}

func (u *userUC) FollowToUser(
	ctx context.Context, follow *models.UserFollow,
) (*models.UserFollow, error) {
	userFromCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(
			errors.WithMessage(err, "userUC.FollowToUser.GetUserFromCtx"),
		)
	}

	follow.UserID = userFromCtx.ID
	if err := utils.ValidateStruct(ctx, follow); err != nil {
		return nil, httpErrors.NewBadRequestError(
			errors.WithMessage(err, "userUC.FollowToUser.ValidateStruct"),
		)
	}

	f, err := u.userRepo.FollowToUser(ctx, follow)
	if err != nil {
		return nil, err
	}

	return f, nil
}

func (u *userUC) UnfollowUser(
	ctx context.Context, follow *models.UserFollow,
) error {
	userFromCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return httpErrors.NewUnauthorizedError(
			errors.WithMessage(err, "userUC.FollowToUser.GetUserFromCtx"),
		)
	}

	follow.UserID = userFromCtx.ID
	if err := utils.ValidateStruct(ctx, follow); err != nil {
		return httpErrors.NewBadRequestError(
			errors.WithMessage(err, "userUC.FollowToUser.ValidateStruct"),
		)
	}

	if err := u.userRepo.UnfollowUser(ctx, follow); err != nil {
		return err
	}

	return nil
}

func (u *userUC) UpdateNotification(
	ctx context.Context, follow *models.UserFollow,
) (*models.UserFollow, error) {
	userFromCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(
			errors.WithMessage(err, "userUC.FollowToUser.GetUserFromCtx"),
		)
	}

	follow.UserID = userFromCtx.ID
	if err := utils.ValidateStruct(ctx, follow); err != nil {
		return nil, httpErrors.NewBadRequestError(
			errors.WithMessage(err, "userUC.FollowToUser.ValidateStruct"),
		)
	}

	f, err := u.userRepo.UpdateNotification(ctx, follow)
	if err != nil {
		return nil, err
	}

	return f, nil
}

func (u *userUC) GetSubscriptions(
	ctx context.Context, userID uuid.UUID,
) (*[]*models.User, error) {
	usersList, err := u.userRepo.GetSubscriptionsByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return usersList, nil
}

func (u *userUC) GetUserSubscriptionsCount(
	ctx context.Context, userID uuid.UUID,
) (uint, error) {
	count, err := u.userRepo.GetUserSubscriptionsCount(ctx, userID)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (u *userUC) GetUserSubscribersCount(
	ctx context.Context, userID uuid.UUID,
) (uint, error) {
	count, err := u.userRepo.GetUserSubscribersCount(ctx, userID)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (u *userUC) SearchByFilter(
	ctx context.Context, filter *models.UserFilter, pq *utils.PaginationQuery,
) (*models.UserList, error) {
	usersList, err := u.userRepo.SearchByFilter(ctx, filter, pq)
	if err != nil {
		return nil, err
	}
	for _, curUser := range usersList.Users {
		subscribersCount, err := u.userRepo.GetUserSubscribersCount(
			ctx, curUser.ID,
		)
		if err != nil {
			curUser.SubscribersCount = 0
		}

		subscriptionsCount, err := u.userRepo.GetUserSubscriptionsCount(
			ctx,
			curUser.ID,
		)
		if err != nil {
			curUser.SubscriptionsCount = 0
		}

		curUser.SubscribersCount = subscribersCount
		curUser.SubscriptionsCount = subscriptionsCount
	}

	return usersList, nil
}

func (u *userUC) GetRecommendedUsers(ctx context.Context) (
	*[]*models.RecUserList, error,
) {
	userFromCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(
			errors.WithMessage(err, "userUC.GetFriends.GetUserFromCtx"),
		)
	}
	userID := userFromCtx.ID

	userFollow, err := u.userRepo.GetRecommendedUsersIDs(ctx, userID)
	if err != nil {
		return nil, err
	}

	m := make(map[uuid.UUID][]uuid.UUID)
	for _, uf := range *userFollow {
		if uf.FollowToUserID == userID {
			continue
		}
		m[uf.FollowToUserID] = append(m[uf.FollowToUserID], uf.UserID)
	}

	var recs []*models.RecUserList
	for k, v := range m {
		recUser, err := u.userRepo.GetMiniUsersByID(ctx, k)
		if err != nil {
			return nil, err
		}
		var fromUsers []*models.MiniUser
		for _, uID := range v {
			u, err := u.userRepo.GetMiniUsersByID(ctx, uID)
			if err != nil {
				return nil, err
			}
			fromUsers = append(fromUsers, u)
		}

		recs = append(
			recs, &models.RecUserList{
				RecUser:        recUser,
				FromUsers:      fromUsers,
				FromUsersCount: len(fromUsers),
			},
		)
	}

	return &recs, nil
}

func (u *userUC) GetFriends(ctx context.Context) (*[]*models.MiniUser, error) {
	userFromCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(
			errors.WithMessage(err, "userUC.GetFriends.GetUserFromCtx"),
		)
	}
	userID := userFromCtx.ID

	uIDs, err := u.userRepo.GetFriendsIDs(ctx, userID)
	if err != nil {
		return nil, err
	}

	var friends []*models.MiniUser
	for _, uID := range *uIDs {
		userByID, err := u.userRepo.GetMiniUsersByID(ctx, *uID)
		if err != nil {
			return nil, err
		}
		friends = append(friends, userByID)
	}

	return &friends, nil
}

func (u *userUC) GetMiniUsersByID(
	ctx context.Context, userID uuid.UUID,
) (*models.MiniUser, error) {
	userByID, err := u.userRepo.GetMiniUsersByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return userByID, nil
}
