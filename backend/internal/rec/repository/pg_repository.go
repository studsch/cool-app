package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/rec"
)

type recPgRepo struct {
	db *pgxpool.Pool
}

func NewRecPgRepo(db *pgxpool.Pool) rec.Repository {
	return &recPgRepo{
		db: db,
	}
}

func (r *recPgRepo) GetPostsByIDs(
	ctx context.Context, ids []string,
) ([]models.Post, error) {
	query := `
SELECT
	p.id, p.user_id, p.description, p.location, p.created_at, p.image_urls,
	u.first_name, u.last_name, u.login, u.avatar,
    COALESCE(likes_count, 0) AS likes_count,
    COALESCE(comments_count, 0) AS comments_count
FROM post AS p
LEFT JOIN users AS u ON p.user_id = u.id
LEFT JOIN (
    SELECT post_id, COUNT(*) AS likes_count
    FROM like_post
    GROUP BY post_id
) AS l ON p.id = l.post_id
LEFT JOIN (
    SELECT post_id, COUNT(*) AS comments_count
    FROM comment
    GROUP BY post_id
) AS c ON p.id = c.post_id
WHERE p.deleted = FALSE AND p.archived = FALSE AND p.id = ANY ($1)
`

	postsList := make([]models.Post, 0)
	rows, err := r.db.Query(ctx, query, ids)
	if err != nil {
		return nil, errors.Wrap(err, "postRepo.GetPostsByIDs.Query")
	}
	defer rows.Close()

	for rows.Next() {
		p := &models.Post{}
		if err := rows.Scan(
			&p.ID, &p.UserID, &p.Description, &p.Location,
			&p.CreatedAt, &p.ImageURLs, &p.UserFirstName, &p.UserLastName,
			&p.UserLogin, &p.UserAvatar, &p.LikeCount, &p.CommentCount,
		); err != nil {
			return nil, errors.Wrap(err, "postRepo.GetPostsByIDs.Scan")
		}
		postsList = append(postsList, *p)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetPostsByIDs.Err")
	}

	return postsList, nil
}
