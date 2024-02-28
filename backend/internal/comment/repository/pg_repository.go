package repository

import (
	"context"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/internal/comment"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// commentRepo Comment repository
type commentRepo struct {
	db *pgxpool.Pool
}

// NewCommentRepository Comment repository constructor
func NewCommentRepository(db *pgxpool.Pool) comment.Repository {
	return &commentRepo{db: db}
}

// Create Creates new comment
func (r *commentRepo) Create(ctx context.Context, comment *models.Comment) (*models.Comment, error) {
	c := &models.Comment{}
	if err := r.db.QueryRow(ctx, createCommentQuery,
		comment.UserID, comment.PostID, comment.ReplyTo, comment.Content,
	).Scan(&c); err != nil {
		return nil, errors.Wrap(err, "commentRepo.Create.Scan")
	}

	return c, nil
}

func (r *commentRepo) Delete(ctx context.Context, commentID uuid.UUID) error {
	//TODO implement me
	panic("implement me")
}

func (r *commentRepo) GetByID(ctx context.Context, commentID uuid.UUID) (*models.CommentBase, error) {
	//TODO implement me
	panic("implement me")
}

func (r *commentRepo) GetAllByPostID(ctx context.Context, postID uuid.UUID, pq *utils.PaginationQuery) (*models.CommentList, error) {
	//TODO implement me
	panic("implement me")
}

func (r *commentRepo) GetReplyByCommentID(ctx context.Context, commentID uuid.UUID, pq *utils.PaginationQuery) {
	//TODO implement me
	panic("implement me")
}
