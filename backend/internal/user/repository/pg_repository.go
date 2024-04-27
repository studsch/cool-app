package repository

import (
	"context"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"

	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/user"
	"github.com/studsch/cool-app/backend/pkg/utils"
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
			&u.Country, &u.Birthday, &u.Login,
		); err != nil {
			return nil, errors.Wrap(
				err, "userRepo.GetSubscriptionsByUserID.Scan",
			)
		}
		usersList = append(usersList, &u)
	}

	return &usersList, nil
}

func (r *userRepo) queryRowsWithFilter(
	ctx context.Context, query string, filter *models.UserFilter,
) (pgx.Rows, error) {
	var filterValues []interface{}

	filterValues = append(filterValues, filter.Q)

	query += `WHERE importance > 0.3 `

	if filter.Gender != "" {
		filterValues = append(filterValues, filter.Gender)
		query += `AND gender = $` + strconv.Itoa(len(filterValues)) + " "
	}
	if !filter.DateStart.IsZero() {
		filterValues = append(filterValues, filter.DateStart)
		query += `AND birthday >= $` + strconv.Itoa(len(filterValues)) + " "
	}
	if !filter.DateEnd.IsZero() {
		filterValues = append(filterValues, filter.DateEnd)
		query += `AND birthday <= $` + strconv.Itoa(len(filterValues)) + " "
	}
	if filter.City != "" {
		filterValues = append(filterValues, filter.City)
		query += `AND city = $` + strconv.Itoa(len(filterValues)) + " "
	}
	if filter.Country != "" {
		filterValues = append(filterValues, filter.Country)
		query += `AND country = $` + strconv.Itoa(len(filterValues)) + " "
	}

	switch filter.OrderBy {
	case "-":
		query += ``
	case "date":
		query += `ORDER BY created_at DESC `
	case "rate":
		// TODO: add this
		query += `ORDER BY importance DESC `
	default:
		query += `ORDER BY importance DESC `
	}

	if filter.Offset != 0 {
		filterValues = append(filterValues, filter.Offset)
		query += `OFFSET $` + strconv.Itoa(len(filterValues)) + " "
	}
	if filter.Limit != 0 {
		filterValues = append(filterValues, filter.Limit)
		query += `LIMIT $` + strconv.Itoa(len(filterValues)) + " "
	}

	return r.db.Query(ctx, query, filterValues...)
}

func (r *userRepo) SearchByFilter(
	ctx context.Context, filter *models.UserFilter, pq *utils.PaginationQuery,
) (*models.UserList, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var totalCount int
	rowsC, err := r.queryRowsWithFilter(
		ctx, searchByFilterGetTotalCountQuery, &models.UserFilter{
			DateStart: filter.DateStart,
			DateEnd:   filter.DateEnd,
			Q:         filter.Q,
			OrderBy:   "-",
			Gender:    filter.Gender,
			City:      filter.City,
			Country:   filter.Country,
			Offset:    0,
			Limit:     0,
		},
	)
	if err != nil {
		return nil, err
	}
	defer rowsC.Close()
	for rowsC.Next() {
		if err := rowsC.Scan(&totalCount); err != nil {
			return nil, errors.Wrap(err, "userRepo.SearchByFilter.Scan")
		}
	}
	if err := rowsC.Err(); err != nil {
		return nil, errors.Wrap(err, "userRepo.SearchByFilter.Err")
	}

	if totalCount == 0 {
		return &models.UserList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore: utils.GetHasMore(
				pq.GetPage(), totalCount, pq.GetSize(),
			),
			Users: make([]*models.User, 0),
		}, nil
	}

	filter.Offset = uint64(pq.GetOffset())
	filter.Limit = uint64(pq.GetSize())

	rows, err := r.queryRowsWithFilter(ctx, searchUserByFilterQuery, filter)
	if err != nil {
		return nil, err
	}

	usersList := make([]*models.User, 0, filter.Limit)
	defer rows.Close()
	for rows.Next() {
		u := &models.User{}
		if err := rows.Scan(
			&u.ID, &u.FirstName, &u.LastName, &u.Avatar,
			&u.Gender, &u.About, &u.City, &u.Country, &u.Birthday,
			&u.CreatedAt, &u.UpdatedAt, &u.Login,
		); err != nil {
			return nil, errors.Wrap(err, "userRepo.SearchByFilter.Scan")
		}
		usersList = append(usersList, u)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "userRepo.SearchByFilter.Err")
	}

	return &models.UserList{
		TotalCount: totalCount,
		TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
		Page:       pq.GetPage(),
		Size:       pq.GetSize(),
		HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
		Users:      usersList,
	}, nil
}

func (r *userRepo) GetRecommendedUsersIDs(
	ctx context.Context, userID uuid.UUID,
) (*[]*models.UserFollow, error) {
	var usersList []*models.UserFollow

	rows, err := r.db.Query(ctx, getRecommendedUsersIDs, &userID)
	if err != nil {
		return nil, errors.Wrap(
			err, "userRepo.GetRecommendedUsers.Query",
		)
	}
	defer rows.Close()

	for rows.Next() {
		var u models.UserFollow
		if err := rows.Scan(
			&u.UserID, &u.FollowToUserID,
		); err != nil {
			return nil, errors.Wrap(
				err, "userRepo.GetRecommendedUsers.Scan",
			)
		}
		usersList = append(usersList, &u)
	}

	return &usersList, nil
}

func (r *userRepo) GetFriendsIDs(
	ctx context.Context, userID uuid.UUID,
) (*[]*uuid.UUID, error) {
	var usersIDs []*uuid.UUID

	rows, err := r.db.Query(ctx, getFriendsIDs, &userID)
	if err != nil {
		return nil, errors.Wrap(
			err, "userRepo.GetFriendsIDs.Query",
		)
	}
	defer rows.Close()

	for rows.Next() {
		var uID uuid.UUID
		if err := rows.Scan(&uID); err != nil {
			return nil, errors.Wrap(
				err, "userRepo.GetFriendsIDs.Scan",
			)
		}
		usersIDs = append(usersIDs, &uID)
	}

	return &usersIDs, nil
}

func (r *userRepo) GetMiniUsersByID(
	ctx context.Context, userID uuid.UUID,
) (*models.MiniUser, error) {
	miniUser := &models.MiniUser{}
	if err := r.db.QueryRow(
		ctx, getMiniUsersByID, &userID,
	).Scan(
		&miniUser.ID, &miniUser.FirstName, &miniUser.LastName,
		&miniUser.Login, &miniUser.Avatar,
	); err != nil {
		return nil, errors.Wrap(err, "userRepo.getMiniUsersByID.Scan")
	}

	return miniUser, nil
}

func (r *userRepo) CheckSubscribeExists(
	ctx context.Context, userID uuid.UUID, toUserID uuid.UUID,
) (bool, error) {
	var out bool
	if err := r.db.QueryRow(
		ctx, subscribeExists, &userID, &toUserID,
	).Scan(&out); err != nil {
		return false, errors.Wrap(err, "userRepo.CheckSubscribeExists.Scan")
	}

	return out, nil
}

func (r *userRepo) CheckUserWithPhoneExists(
	ctx context.Context, phone string,
) (bool, error) {
	query := `
SELECT EXISTS(
SELECT 1 FROM users
WHERE phone_number = $1
)
`
	var out bool
	if err := r.db.QueryRow(
		ctx, query, phone,
	).Scan(&out); err != nil {
		return false, errors.Wrap(err, "userRepo.CheckUserWithPhoneExists.Scan")
	}
	return out, nil
}

func (r *userRepo) CheckUserWithLoginExists(
	ctx context.Context, login string,
) (bool, error) {
	query := `
SELECT EXISTS(
SELECT 1 FROM users
WHERE login = $1
)
`
	var out bool
	if err := r.db.QueryRow(
		ctx, query, login,
	).Scan(&out); err != nil {
		return false, errors.Wrap(err, "userRepo.CheckUserWithLoginExists.Scan")
	}
	return out, nil
}

func (r *userRepo) GetUserByLogin(
	ctx context.Context, login string,
) (*models.User, error) {
	query := `
SELECT
	id, first_name, last_name, login,
	phone_number, role, avatar, gender, about,
	city, country, birthday, created_at, updated_at
FROM users WHERE login = $1
`
	foundUser := &models.User{}
	if err := r.db.QueryRow(ctx, query, login).Scan(
		&foundUser.ID, &foundUser.FirstName, &foundUser.LastName,
		&foundUser.Login, &foundUser.PhoneNumber, &foundUser.Role,
		&foundUser.Avatar, &foundUser.Gender, &foundUser.About,
		&foundUser.City, &foundUser.Country, &foundUser.Birthday,
		&foundUser.CreatedAt, &foundUser.UpdatedAt,
	); err != nil {
		return nil, errors.Wrap(err, "userRepo.GetUserByLogin.Scan")
	}
	return foundUser, nil
}
