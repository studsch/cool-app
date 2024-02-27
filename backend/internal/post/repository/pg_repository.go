package repository

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/post"
)

// postRepo Post repository
type postRepo struct {
	db *pgxpool.Pool
}

// NewPostRepository Post repository constructor
func NewPostRepository(db *pgxpool.Pool) post.Repository {
	return &postRepo{db: db}
}

// Create Creates new post
func (r *postRepo) Create(ctx context.Context, post *models.Post) (*models.Post, error) {
	p := &models.Post{}
	if err := r.db.QueryRow(ctx, createPostQuery,
		&post.UserID, &post.Description, &post.Location, &post.ImageURLs,
		false, false,
	).Scan(&p); err != nil {
		return nil, errors.Wrap(err, "postRepo.Create.Scan")
	}

	return p, nil
}
