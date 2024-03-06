package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/internal/models"
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
	).Scan(&u); err != nil {
		return nil, errors.Wrap(err, "authRepo.Register.Scan")
	}

	return u, nil
}

// FindByLogin Find user by login
func (r *authRepo) FindByLogin(ctx context.Context, user *models.User) (*models.User, error) {
	foundUser := &models.User{}
	if err := r.db.QueryRow(ctx, findUserByLoginQuery, user.Login).Scan(&foundUser); err != nil {
		return nil, errors.Wrap(err, "authRepo.FindByLogin.Scan")
	}
	return foundUser, nil
}

// FindByPhoneNumber Find user by phone number
func (r *authRepo) FindByPhoneNumber(ctx context.Context, user *models.User) (*models.User, error) {
	foundUser := &models.User{}
	if err := r.db.QueryRow(ctx, findUserByPhoneQuery, user.PhoneNumber).Scan(&foundUser); err != nil {
		return nil, errors.Wrap(err, "authRepo.FindByPhoneNumber.Scan")
	}
	return foundUser, nil
}

// GetByID Get user by id
func (r *authRepo) GetByID(ctx context.Context, userID uuid.UUID) (*models.User, error) {
	user := &models.User{}
	if err := r.db.QueryRow(ctx, getUserByIDQuery, userID).Scan(&user); err != nil {
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
	).Scan(&u); err != nil {
		return nil, errors.Wrap(err, "authRepo.Update.Scan")
	}

	return u, nil
}
