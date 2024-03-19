package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// authRepo Auth repository
type authRepo struct {
	db *pgxpool.Pool
}

// NewAuthRepository Auth repository constructor
func NewAuthRepository(db *pgxpool.Pool) auth.Repository {
	return &authRepo{db: db}
}

// Register Create new user
func (r *authRepo) Register(ctx context.Context, user *models.User) (*models.User, error) {
	u := &models.User{}
	if err := r.db.QueryRow(ctx, createUserQuery,
		&user.FirstName, &user.LastName, &user.Login, &user.Password, &user.PhoneNumber,
		&user.Role, &user.Avatar, &user.Gender, &user.About, &user.City,
		&user.Country, &user.Birthday,
	).Scan(
		&u.ID, &u.FirstName, &u.LastName, &u.Login,
		&u.Password, &u.PhoneNumber, &u.Role, &u.Avatar,
		&u.Gender, &u.About, &u.City, &u.Country,
		&u.Birthday, &u.CreatedAt, &u.UpdatedAt,
	); err != nil {
		return nil, errors.Wrap(err, "authRepo.Register.Scan")
	}

	return u, nil
}

// FindByLogin Find user by login
func (r *authRepo) FindByLogin(ctx context.Context, user *models.User) (*models.User, error) {
	foundUser := &models.User{}
	if err := r.db.QueryRow(ctx, findUserByLoginQuery, user.Login).Scan(
		&foundUser.ID, &foundUser.FirstName, &foundUser.LastName, &foundUser.Login,
		&foundUser.Password, &foundUser.PhoneNumber, &foundUser.Role, &foundUser.Avatar,
		&foundUser.Gender, &foundUser.About, &foundUser.City, &foundUser.Country,
		&foundUser.Birthday, &foundUser.CreatedAt, &foundUser.UpdatedAt,
	); err != nil {
		return nil, errors.Wrap(err, "authRepo.FindByLogin.Scan")
	}
	return foundUser, nil
}

// FindByPhoneNumber Find user by phone number
func (r *authRepo) FindByPhoneNumber(ctx context.Context, user *models.User) (*models.User, error) {
	foundUser := &models.User{}
	if err := r.db.QueryRow(ctx, findUserByPhoneQuery, user.PhoneNumber).Scan(
		&foundUser.ID, &foundUser.FirstName, &foundUser.LastName, &foundUser.Login,
		&foundUser.Password, &foundUser.PhoneNumber, &foundUser.Role, &foundUser.Avatar,
		&foundUser.Gender, &foundUser.About, &foundUser.City, &foundUser.Country,
		&foundUser.Birthday, &foundUser.CreatedAt, &foundUser.UpdatedAt,
	); err != nil {
		return nil, errors.Wrap(err, "authRepo.FindByPhoneNumber.Scan")
	}
	return foundUser, nil
}

// GetByID Get user by id
func (r *authRepo) GetByID(ctx context.Context, userID uuid.UUID) (*models.User, error) {
	user := &models.User{}
	if err := r.db.QueryRow(ctx, getUserByIDQuery, userID).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Login,
		&user.Password, &user.PhoneNumber, &user.Role, &user.Avatar,
		&user.Gender, &user.About, &user.City, &user.Country,
		&user.Birthday, &user.CreatedAt, &user.UpdatedAt,
	); err != nil {
		return nil, errors.Wrap(err, "authRepo.GetByID.Scan")
	}
	return user, nil
}

func (r *authRepo) Update(ctx context.Context, user *models.User) (*models.User, error) {
	u := &models.User{}
	if err := r.db.QueryRow(ctx, updateUserQuery,
		&user.FirstName, &user.LastName, &user.Login, &user.Password,
		&user.PhoneNumber, &user.Role, &user.Avatar, &user.Gender,
		&user.About, &user.City, &user.Country,
		&user.ID,
	).Scan(
		&u.ID, &u.FirstName, &u.LastName, &u.Login,
		&u.Password, &u.PhoneNumber, &u.Role, &u.Avatar,
		&u.Gender, &u.About, &u.City, &u.Country,
		&u.Birthday, &u.CreatedAt, &u.UpdatedAt,
	); err != nil {
		return nil, errors.Wrap(err, "authRepo.Update.Scan")
	}

	return u, nil
}

func (r *authRepo) Search(ctx context.Context, q string, pq *utils.PaginationQuery) (*models.UserList, error) {
	var totalCount int
	if err := r.db.QueryRow(ctx, searchGetTotalCountQuery, q).Scan(&totalCount); err != nil {
		return nil, errors.Wrap(err, "authRepo.Search.Scan")
	}

	if totalCount == 0 {
		return &models.UserList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
			Users:      make([]*models.User, 0),
		}, nil
	}

	usersList := make([]*models.User, 0, pq.GetSize())
	rows, err := r.db.Query(ctx, searchUserQuery, q, pq.GetOffset(), pq.GetLimit())
	if err != nil {
		return nil, errors.Wrap(err, "authRepo.Search.Query")
	}
	defer rows.Close()

	for rows.Next() {
		u := &models.User{}
		if err := rows.Scan(
			&u.ID, &u.FirstName, &u.LastName, &u.Avatar,
			&u.Gender, &u.About, &u.City, &u.Country, &u.Birthday,
			&u.CreatedAt, &u.UpdatedAt,
		); err != nil {
			return nil, errors.Wrap(err, "authRepo.Search.Scan")
		}
		usersList = append(usersList, u)
	}
	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "authRepo.Search.Err")
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
