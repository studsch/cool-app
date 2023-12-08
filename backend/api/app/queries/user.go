package queries

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/studsch/cool-app/backend/app/models"
)

type UserQueries struct {
	*pgxpool.Pool
}

func (q *UserQueries) CreateUser(ctx context.Context, u *models.User) error {
	query := `
		INSERT INTO users
			(login, phone, password_hash, name, surname, date_of_birth, gender, created_at, updated_at, user_role, deleted)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id
	`

	row := q.QueryRow(
		ctx,
		query,
		u.Login,
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
		// var pgErr *pgconn.PgError
		// if errors.As(err, &pgErr) {
		// 	newErr := fmt.Errorf("SQL Error: %s, Detail: %s, Where %s, Code: %s, SQLState: %s", pgErr.Message, pgErr.Detail, pgErr.Where, pgErr.Code, pgErr.SQLState())
		// 	fmt.Println(newErr)
		// 	return nil
		// }
		return err
	}

	return nil
}

func (q *UserQueries) GetUserByPhone(ctx context.Context, p string) (models.User, error) {
	query := `
		SELECT
			(id, login, phone, password_hash, name, surname, date_of_birth, gender, created_at, updated_at, user_role, deleted)
		from users
		WHERE phone = $1 AND deleted<>true
	`
	user := models.User{}

	err := q.QueryRow(ctx, query, p).Scan(&user)
	if err != nil {
		return user, err
	}

	return user, nil
}

func (q *UserQueries) GetUserByLogin(ctx context.Context, l string) (models.User, error) {
	query := `
		SELECT
			(id, login, phone, password_hash, name, surname, date_of_birth, gender, created_at, updated_at, user_role, deleted)
		from users
		WHERE login = $1 AND deleted<>true
	`
	user := models.User{}

	err := q.QueryRow(ctx, query, l).Scan(&user)
	if err != nil {
		return user, err
	}

	return user, nil
}

func (q *UserQueries) GetUserById(ctx context.Context, id uuid.UUID) (models.User, error) {
	query := `
		SELECT
			(id, login, phone, password_hash, name, surname, date_of_birth, gender, created_at, updated_at, user_role, deleted)
		from users
		WHERE id = $1 AND deleted<>true
	`
	user := models.User{}

	err := q.QueryRow(ctx, query, id).Scan(&user)
	if err != nil {
		return user, err
	}

	return user, nil
}

func (q *UserQueries) FollowToUser(ctx context.Context, id uuid.UUID, toId uuid.UUID) error {
	query := `
		INSERT INTO follow
			(user_id, user_id_to)
		VALUES
			($1, $2)
		RETURNING id
	`
	var followId uuid.UUID
	err := q.QueryRow(ctx, query, id, toId).Scan(&followId)
	if err != nil {
		return err
	}

	return nil
}

func (q *UserQueries) UnfollowToUser(ctx context.Context, id uuid.UUID, toId uuid.UUID) error {
	query := `
		delete from follow
		where user_id=$1 and user_id_to=$2
	`

	ct, err := q.Exec(ctx, query, id, toId)
	if err != nil {
		return err
	}
	if ct.RowsAffected() != 1 {
		return errors.New("no row found to delete")
	}

	return nil
}
