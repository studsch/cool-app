package queries

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/studsch/cool-app/backend/app/models"
)

type CommentQueries struct {
	*pgxpool.Pool
}

func (q *CommentQueries) CreateComment(ctx context.Context, c *models.Comment) error {
	query := `
		insert into comment
			(id, user_id, post_id, content, deleted, created_at)
		values
			(default, $1, $2, $3, default, default)
		returning id, deleted, created_at
	`

	row := q.QueryRow(ctx, query, c.UserID, c.PostID, c.Content)
	if err := row.Scan(&c.ID, &c.Deleted, &c.CreatedAt); err != nil {
		return err
	}

	return nil
}

func (q *CommentQueries) ReplyTo(ctx context.Context, r *models.Reply) error {
	query := `
		insert into comment
			(id, user_id, post_id, reply_to_comment_id, content, deleted, created_at)
		values
			(default, $1, $2, $3, $4, default, default)
		returning id, deleted, created_at
	`

	row := q.QueryRow(ctx, query, r.UserID, r.PostID, r.ReplyToCommentID, r.Content)
	if err := row.Scan(&r.ID, &r.Deleted, &r.CreatedAt); err != nil {
		return err
	}

	return nil
}

func (q *CommentQueries) GetCommentsByPostID(ctx context.Context, postID uuid.UUID) ([]models.Reply, error) {
	query := `
		select id, user_id, post_id, reply_to_comment_id, content, deleted, created_at
		from comment
		where post_id=$1 and deleted=false
	`
	var comments []models.Reply

	rows, err := q.Query(ctx, query, postID)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var comment models.Reply

		err = rows.Scan(&comment.ID, &comment.UserID, &comment.PostID, &comment.ReplyToCommentID, &comment.Content, &comment.Deleted, &comment.CreatedAt)
		if err != nil {
			return nil, err
		}

		comments = append(comments, comment)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return comments, nil
}
