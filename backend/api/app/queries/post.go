package queries

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/studsch/cool-app/backend/app/models"
)

type PostQueries struct {
	*pgxpool.Pool
}

func (q *PostQueries) GetPosts(ctx context.Context) ([]models.Post, error) {
	query := `
		SELECT id, user_id, description, location, created_at, archived, deleted
		FROM post
		WHERE deleted=false AND archived=false
	`
	var posts []models.Post

	rows, err := q.Query(ctx, query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var post models.Post

		err = rows.Scan(&post.ID, &post.UserID, &post.Description, &post.Location, &post.CreatedAt, &post.Archived, &post.Deleted)
		if err != nil {
			return nil, err
		}

		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (q *PostQueries) CreatePost(ctx context.Context, p *models.Post) error {
	query := `
		INSERT INTO post
		    (id, user_id, description, location, created_at, archived, deleted)
		VALUES
		    (DEFAULT, $1, $2, $3, $4, DEFAULT, DEFAULT)
		RETURNING id
	`

	row := q.QueryRow(
		ctx,
		query,
		p.UserID,
		p.Description,
		p.Location,
		p.CreatedAt,
	)
	if err := row.Scan(&p.ID); err != nil {
		return err
	}

	return nil
}

func (q *PostQueries) GetPostById(ctx context.Context, id uuid.UUID) (models.Post, error) {
	query := `
		SELECT id, user_id, description, location, created_at, archived, deleted
		FROM post
		WHERE id=$1 AND deleted=false AND archived=false
		LIMIT 1
	`
	var post models.Post

	row := q.QueryRow(ctx, query, id)
	err := row.Scan(
		&post.ID,
		&post.UserID,
		&post.Description,
		&post.Location,
		&post.CreatedAt,
		&post.Archived,
		&post.Deleted,
	)
	if err != nil {
		return post, err
	}

	return post, nil
}

func (q *PostQueries) GetPostsByUserId(ctx context.Context, id uuid.UUID) ([]models.Post, error) {
	query := `
		SELECT id, user_id, description, location, created_at, archived, deleted
		FROM post
		WHERE user_id=$1 AND deleted=false AND archived=false
	`
	var posts []models.Post

	rows, err := q.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var post models.Post

		err = rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Description,
			&post.Location,
			&post.CreatedAt,
			&post.Archived,
			&post.Deleted,
		)
		if err != nil {
			return nil, err
		}

		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (q *PostQueries) UpdatePostDescription(ctx context.Context, id uuid.UUID, d string) error {
	query := `
		UPDATE post
		SET description=$2
		WHERE id=$1 AND deleted=false AND archived=false
	`
	exec, err := q.Exec(ctx, query, id, d)
	if err != nil {
		return err
	}
	if exec.RowsAffected() == 0 {
		return errors.New("post with id not found")
	}

	return nil
}

func (q *PostQueries) UpdatePostLocation(ctx context.Context, id uuid.UUID, l string) error {
	query := `
		UPDATE post
		SET location=$2
		WHERE id=$1 AND deleted=false AND archived=false
	`
	exec, err := q.Exec(ctx, query, id, l)
	if err != nil {
		return err
	}
	if exec.RowsAffected() == 0 {
		return errors.New("post with id not found")
	}

	return nil
}

func (q *PostQueries) UpdatePost(ctx context.Context, id uuid.UUID, d, l string) error {
	query := `
		UPDATE post
		SET description=$2, location=$3
		WHERE id=$1 AND deleted=false AND archived=false
	`
	exec, err := q.Exec(ctx, query, id, d, l)
	if err != nil {
		return err
	}
	if exec.RowsAffected() == 0 {
		return errors.New("post with id not found")
	}

	return nil
}

func (q *PostQueries) ArchivePostById(ctx context.Context, id uuid.UUID) error {
	query := `
		UPDATE post
		SET archived=true
		WHERE id=$1 AND deleted<>true AND archived<>true
	`
	exec, err := q.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if exec.RowsAffected() == 0 {
		return errors.New("post with id not found")
	}

	return nil
}

func (q *PostQueries) DeletePostById(ctx context.Context, id uuid.UUID) error {
	query := `
		UPDATE post
		SET deleted=true
		WHERE id=$1 AND deleted<>true
	`
	exec, err := q.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if exec.RowsAffected() == 0 {
		return errors.New("post with id not found")
	}

	return nil
}
