package queries

import (
	"context"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/studsch/cool-app/backend/app/models"
)

type UserQueries struct {
	*pgxpool.Pool
}

func (q *UserQueries) CreateUser(ctx context.Context, u *models.User) error {
	query := `
		INSERT INTO users
			(phone, password_hash, name, surname, date_of_birth, gender, created_at, updated_at, user_role, deleted)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id
	`

	row := q.QueryRow(
		ctx,
		query,
		u.Phone,
		u.PasswordHash,
		u.Name,
		u.Surname,
		u.DateOfBirth,
		u.Gender,
		u.CreatedAt,
		u.UpdatedAt,
		u.UserRole,
		u.Deleted,
	)
	if err := row.Scan(&u.ID); err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			newErr := fmt.Errorf("SQL Error: %s, Detail: %s, Where %s, Code: %s, SQLState: %s", pgErr.Message, pgErr.Detail, pgErr.Where, pgErr.Code, pgErr.SQLState())
			fmt.Println(newErr)
			return nil
		}
		return err
	}

	return nil
}

// func (q *UserQueries) GetUserByID(ctx context.Context, id uuid.UUID) (models.User, error) {
// 	user := models.User{}
// 	query := `SELECT * FROM users WHERE id = $1`

// 	err := q.QueryRow(ctx, query, id).Scan(&user)
// 	if err != nil {
// 		return user, err
// 	}
// 	return user, nil
// }
