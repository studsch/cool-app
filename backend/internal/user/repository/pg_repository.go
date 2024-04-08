package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"

	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/user"
)

type userRepo struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) user.Repository {
	return &userRepo{db: db}
}

func (r *userRepo) FollowToUser(
	ctx context.Context, follow *models.UserFollow,
) (*models.UserFollow, error) {
	followUser := &models.UserFollow{}
	if err := r.db.QueryRow(
		ctx, followToUser,
		&follow.UserID, &follow.FollowToUserID, &follow.NotificationOn,
	).Scan(
		&followUser.ID, &followUser.UserID,
		&followUser.FollowToUserID, &followUser.NotificationOn,
	); err != nil {
		fmt.Println(err)
		return nil, errors.Wrap(err, "userRepo.FollowToUser.Scan")
	}

	return followUser, nil
}

func (r *userRepo) UnfollowUser(
	ctx context.Context, follow *models.UserFollow,
) error {
	exec, err := r.db.Exec(
		ctx, unfollowUser,
		follow.UserID, follow.FollowToUserID,
	)
	if err != nil {
		return errors.Wrap(err, "userRepo.Unfollow.Exec")
	}
	if exec.RowsAffected() == 0 {
		return errors.Wrap(errors.New("follow not found"), "userRepo.Unfollow")
	}

	return nil
}

func (r *userRepo) UpdateNotification(
	ctx context.Context, follow *models.UserFollow,
) (*models.UserFollow, error) {
	followUser := &models.UserFollow{}
	if err := r.db.QueryRow(
		ctx, updateNotification,
		&follow.NotificationOn, &follow.UserID, &follow.FollowToUserID,
	).Scan(
		&followUser.ID, &followUser.UserID,
		&followUser.FollowToUserID, &followUser.NotificationOn,
	); err != nil {
		return nil, errors.Wrap(err, "userRepo.UpdateNotification.Scan")
	}

	return followUser, nil
}

func (r *userRepo) GetUserSubscribersCount(
	ctx context.Context, userID uuid.UUID,
) (uint, error) {
	var count uint

	if err := r.db.QueryRow(
		ctx, getCountOfSubscribers, &userID,
	).Scan(&count); err != nil {
		return 0, errors.Wrap(err, "userRepo.GetUserSubscribersCount.Scan")
	}

	return count, nil
}

func (r *userRepo) GetUserSubscriptionsCount(
	ctx context.Context, userID uuid.UUID,
) (uint, error) {
	var count uint

	if err := r.db.QueryRow(
		ctx, getCountOfSubscriptions, &userID,
	).Scan(&count); err != nil {
		return 0, errors.Wrap(err, "userRepo.GetUserSubscriptionsCount.Scan")
	}

	return count, nil
}

func (r *userRepo) GetSubscriptionsUserIDs(
	ctx context.Context, userID uuid.UUID,
) (*[]uuid.UUID, error) {
	var subscriptions []uuid.UUID

	rows, err := r.db.Query(ctx, getSubscriptionsUserIDs, userID)
	if err != nil {
		return nil, errors.Wrap(err, "userRepo.GetSubscriptionsUserIDs.Query")
	}
	defer rows.Close()

	for rows.Next() {
		var ID uuid.UUID
		if err := rows.Scan(&ID); err != nil {
			return nil, errors.Wrap(
				err, "userRepo.GetSubscriptionsUserIDs.Scan",
			)
		}
		subscriptions = append(subscriptions, ID)
	}

	return &subscriptions, nil
}

func (r *userRepo) GetUsersInfoByIDs(
	ctx context.Context, userIDs *[]uuid.UUID,
) (*[]*models.User, error) {
	var usersList []*models.User

	rows, err := r.db.Query(ctx, getUsersInfoByIDs, &userIDs)
	if err != nil {
		return nil, errors.Wrap(
			err, "userRepo.GetUsersInfoByIDs.Query",
		)
	}
	defer rows.Close()

	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.FirstName); err != nil {
			return nil, errors.Wrap(
				err, "userRepo.GetUsersInfoByIDs.Scan",
			)
		}
		usersList = append(usersList, &u)
	}

	return &usersList, nil
}

func (r *userRepo) GetSubscriptionsByUserID(
	ctx context.Context, userID uuid.UUID,
) (*[]*models.User, error) {
	var usersList []*models.User

	rows, err := r.db.Query(ctx, getSubscriptionsByUserID, &userID)
	if err != nil {
		return nil, errors.Wrap(
			err, "userRepo.GetSubscriptionsByUserID.Query",
		)
	}
	defer rows.Close()

	for rows.Next() {
		var u models.User
		if err := rows.Scan(
			&u.ID, &u.FirstName, &u.LastName, &u.Login,
			&u.Avatar, &u.Gender, &u.About, &u.City,
			&u.Country, &u.Birthday,
		); err != nil {
			return nil, errors.Wrap(
				err, "userRepo.GetSubscriptionsByUserID.Scan",
			)
		}
		usersList = append(usersList, &u)
	}

	return &usersList, nil
}
