package repository

import (
	"context"
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
	if err := r.db.QueryRow(ctx, createUserQuery, &user.FirstName, &user.LastName, &user.Login,
		&user.Password, &user.PhoneNumber, &user.Role, &user.Avatar, &user.Gender, &user.About,
		&user.City, &user.Country, &user.Birthday,
	).Scan(&u.ID, &u.FirstName, &u.LastName, &u.Login, &u.Password, &u.PhoneNumber, &u.Role,
		&u.Avatar, &u.Gender, &u.About, &u.City, &u.Country, &u.Birthday, &u.CreatedAt, &u.UpdatedAt,
	); err != nil {
		return nil, errors.Wrap(err, "authRepo.Register.Scan")
	}

	return u, nil
}
