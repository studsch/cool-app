package repository

import (
	"context"
	"fmt"

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
