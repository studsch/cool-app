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
		SELECT id, user_id, description, location, created_at, archived, deleted, media
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

		err = rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Description,
			&post.Location,
			&post.CreatedAt,
			&post.Archived,
			&post.Deleted,
			&post.Media,
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

func (q *PostQueries) CreatePost(ctx context.Context, p *models.Post) error {
	query := `
		INSERT INTO post
		    (id, user_id, description, location, media, created_at, archived, deleted)
		VALUES
		    ($5, $1, $2, $3, $4, DEFAULT, DEFAULT, DEFAULT)
		RETURNING id, created_at
	`

	row := q.QueryRow(
		ctx,
		query,
		p.UserID,
		p.Description,
		p.Location,
		p.Media,
		p.ID,
	)
	if err := row.Scan(&p.ID, &p.CreatedAt); err != nil {
		return err
	}

	return nil
}

func (q *PostQueries) GetPostById(ctx context.Context, id uuid.UUID) (models.Post, error) {
	query := `
		SELECT id, user_id, description, location, created_at, archived, deleted, media
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
		&post.Media,
	)
	if err != nil {
		return post, err
	}

	return post, nil
}

func (q *PostQueries) GetPostsByUserId(ctx context.Context, id uuid.UUID) ([]models.Post, error) {
	query := `
		SELECT id, user_id, description, location, created_at, archived, deleted, media
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
			&post.Media,
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

func (q *PostQueries) UpdatePost(
	ctx context.Context,
	id uuid.UUID,
	desc, loc string,
	media []string,
) error {
	query := `
		UPDATE post
		SET description=$2, location=$3, media=$4
		WHERE id=$1 AND deleted=false AND archived=false
	`
	exec, err := q.Exec(ctx, query, id, desc, loc, media)
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

func (q *PostQueries) LikePost(ctx context.Context, like *models.LikePost) error {
	query := `
		insert into like_post
			(id, user_id, post_id)
		values
			(default, $1, $2)
		returning id
	`

	row := q.QueryRow(ctx, query, like.UserID, like.PostID)
	if err := row.Scan(&like.ID); err != nil {
		return err
	}

	return nil
}

func (q *PostQueries) UnlikePost(ctx context.Context, like *models.LikePost) error {
	query := `
		delete from like_post
		where user_id=$1 and post_id=$2
	`

	ct, err := q.Exec(ctx, query, &like.UserID, &like.PostID)
	if err != nil {
		return err
	}
	if ct.RowsAffected() != 1 {
		return errors.New("no row found to delete")
	}

	return nil
}

func (q *PostQueries) GetPostLikeCount(ctx context.Context, postID uuid.UUID) (uint, error) {
	query := `
		select count(*)
		from like_post
		where post_id=$1
	`
	var count uint

	row := q.QueryRow(ctx, query, postID)
	if err := row.Scan(&count); err != nil {
		return count, err
	}

	return count, nil
}
