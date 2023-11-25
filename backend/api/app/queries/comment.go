package queries

import (
	"context"

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
		returning (id, deleted, created_at)
	`

	row := q.QueryRow(ctx, query, c.UserID, c.PostID, c.Content)
	if err := row.Scan(&c.ID, &c.Deleted, &c.CreatedAt); err != nil {
		return err
	}

	return nil
}
