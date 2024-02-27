package repository

import (
	"context"
	"github.com/google/uuid"
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
	var p models.Post
	if err := r.db.QueryRow(ctx, createPostQuery,
		&post.UserID, &post.Description, &post.Location, &post.ImageURLs,
		false, false,
	).Scan(&p); err != nil {
		return nil, errors.Wrap(err, "postRepo.Create.Scan")
	}

	return &p, nil
}

// Update Updates post
func (r *postRepo) Update(ctx context.Context, post *models.Post) (*models.Post, error) {
	var p models.Post
	if err := r.db.QueryRow(ctx, updatePostQuery,
		&post.Description, &post.Location, &post.ImageURLs, &post.ID,
	).Scan(&p); err != nil {
		return nil, errors.Wrap(err, "postRepo.Update.Scan")
	}

	return &p, nil
}

// Archive Archives post
func (r *postRepo) Archive(ctx context.Context, postID uuid.UUID) error {
	exec, err := r.db.Exec(ctx, archivePostQuery, postID)
	if err != nil {
		return errors.Wrap(err, "postRepo.Archive.Exec")
	}
	if exec.RowsAffected() == 0 {
		return errors.Wrap(errors.New("post with id not found"), "postRepo.Archive")
	}

	return nil
}

// Delete Deletes post
func (r *postRepo) Delete(ctx context.Context, postID uuid.UUID) error {
	exec, err := r.db.Exec(ctx, deletePostQuery, postID)
	if err != nil {
		return errors.Wrap(err, "postRepo.Delete.Exec")
	}
	if exec.RowsAffected() == 0 {
		return errors.Wrap(errors.New("post with id not found"), "postRepo.Delete")
	}

	return nil
}

// GetByID Get post by id
func (r *postRepo) GetByID(ctx context.Context, postID uuid.UUID) (*models.PostBase, error) {
	var p models.PostBase
	if err := r.db.QueryRow(ctx, getByIdQuery, postID).Scan(&p); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetByID.Scan")
	}

	return &p, nil
}
