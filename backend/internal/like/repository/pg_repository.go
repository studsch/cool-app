package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/internal/like"
	"github.com/studsch/cool-app/backend/internal/models"
)

type likeRepo struct {
	db *pgxpool.Pool
}

// LikeComment implements like.Repository.
func (r *likeRepo) LikeComment(ctx context.Context, like *models.LikeComment) (*models.LikeComment, error) {
	commentLike := &models.LikeComment{}
	if err := r.db.QueryRow(ctx, likeCommentQuery,
		&like.UserID, &like.CommentID,
	).Scan(
		&commentLike.ID, &commentLike.UserID, &commentLike.CommentID,
	); err != nil {
		return nil, errors.Wrap(err, "likeRepo.LikeComment.Scan")
	}
	return commentLike, nil
}

// UnlikeComment implements like.Repository.
func (r *likeRepo) UnlikeComment(ctx context.Context, like *models.LikeComment) error {
	exec, err := r.db.Exec(ctx, unlikeCommentQuery, &like.UserID, &like.CommentID)
	if err != nil {
		return errors.Wrap(err, "likeRepo.UnlikeComment.Exec")
	}
	if exec.RowsAffected() == 0 {
		return errors.Wrap(errors.New("like not fount"), "likeRepo.UnlikeComment")
	}

	return nil
}

// GetPostLikeCount implements like.Repository.
func (r *likeRepo) GetPostLikeCount(ctx context.Context, postID uuid.UUID) (uint, error) {
	var postLikeCount uint
	if err := r.db.QueryRow(ctx, getPostLikeCountQuery, postID).Scan(&postLikeCount); err != nil {
		return 0, errors.Wrap(err, "likeRepo.GetPostLikeCount.Scan")
	}

	return postLikeCount, nil
}

// LikePost implements like.Repository.
func (r *likeRepo) LikePost(ctx context.Context, like *models.LikePost) (*models.LikePost, error) {
	postLike := &models.LikePost{}
	if err := r.db.QueryRow(ctx, likePostQuery,
		&like.UserID, &like.PostID,
	).Scan(
		&postLike.ID, &postLike.UserID, &postLike.PostID,
	); err != nil {
		return nil, errors.Wrap(err, "likeRepo.LikePost.Scan")
	}
	return postLike, nil
}

// UnlikePost implements like.Repository.
func (r *likeRepo) UnlikePost(ctx context.Context, like *models.LikePost) error {
	exec, err := r.db.Exec(ctx, unlikePostQuery, &like.UserID, &like.PostID)
	if err != nil {
		return errors.Wrap(err, "likeRepo.UnlikePost.Exec")
	}
	if exec.RowsAffected() == 0 {
		return errors.Wrap(errors.New("like not fount"), "likeRepo.UnlikePost")
	}

	return nil
}

func NewLikeRepository(db *pgxpool.Pool) like.Repository {
	return &likeRepo{db: db}
}
