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
	).Scan(
		&c.ID, &c.UserID, &c.PostID, &c.ReplyTo,
		&c.Content, &c.CreatedAt,
	); err != nil {
		return nil, errors.Wrap(err, "commentRepo.Create.Scan")
	}

	return c, nil
}

// Delete Deletes comment
func (r *commentRepo) Delete(ctx context.Context, commentID uuid.UUID) error {
	exec, err := r.db.Exec(ctx, deleteCommentQuery, commentID)
	if err != nil {
		return errors.Wrap(err, "commentRepo.Delete.Exec")
	}
	if exec.RowsAffected() == 0 {
		return errors.Wrap(errors.New("comment with id not found"), "commentRepo.Delete")
	}

	return nil
}

func (r *commentRepo) GetByID(ctx context.Context, commentID uuid.UUID) (*models.CommentBase, error) {
	c := &models.CommentBase{}
	if err := r.db.QueryRow(ctx, getByIdQuery, commentID).Scan(
		&c.ID, &c.UserID, &c.PostID, &c.ReplyTo, &c.Content,
		&c.CreatedAt, &c.Author, &c.AvatarURL,
	); err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetByID.Scan")
	}

	return c, nil
}

func (r *commentRepo) GetAllByPostID(ctx context.Context, postID uuid.UUID, pq *utils.PaginationQuery) (*models.CommentList, error) {
	var totalCount int
	if err := r.db.QueryRow(ctx, getTotalCountByPostQuery, postID).Scan(&totalCount); err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetAllByPostID.Scan")
	}

	if totalCount == 0 {
		return &models.CommentList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
			Comments:   make([]*models.CommentBase, 0),
		}, nil
	}

	var commList = make([]*models.CommentBase, 0, pq.GetSize())
	rows, err := r.db.Query(ctx, getAllByPostIdQuery, postID, pq.GetOffset(), pq.GetLimit())
	if err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetAllByPostID.Query")
	}
	defer rows.Close()

	for rows.Next() {
		c := &models.CommentBase{}
		if err := rows.Scan(
			&c.ID, &c.UserID, &c.PostID, &c.ReplyTo,
			&c.Content, &c.CreatedAt, &c.Author, &c.AvatarURL,
		); err != nil {
			return nil, errors.Wrap(err, "commentRepo.GetAllByPostID.Scan")
		}
		commList = append(commList, c)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetAllByPostID.Err")
	}

	return &models.CommentList{
		TotalCount: totalCount,
		TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
		Page:       pq.GetPage(),
		Size:       pq.GetSize(),
		HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
		Comments:   commList,
	}, nil
}

func (r *commentRepo) GetReplyByCommentID(ctx context.Context, commentID uuid.UUID, pq *utils.PaginationQuery) (*models.CommentList, error) {
	var totalCount int
	if err := r.db.QueryRow(ctx, getTotalCountReplyByCommentQuery, commentID).Scan(&totalCount); err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetReplyByCommentID.Scan")
	}

	if totalCount == 0 {
		return &models.CommentList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
			Comments:   make([]*models.CommentBase, 0),
		}, nil
	}

	var commList = make([]*models.CommentBase, 0, pq.GetSize())
	rows, err := r.db.Query(ctx, getReplyByCommentIdQuery, commentID, pq.GetOffset(), pq.GetLimit())
	if err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetAllByPostID.Query")
	}
	defer rows.Close()

	for rows.Next() {
		c := &models.CommentBase{}
		if err := rows.Scan(
			&c.ID, &c.UserID, &c.PostID, &c.ReplyTo,
			&c.Content, &c.CreatedAt, &c.Author, &c.AvatarURL,
		); err != nil {
			return nil, errors.Wrap(err, "commentRepo.GetAllByPostID.Scan")
		}
		commList = append(commList, c)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetAllByPostID.Err")
	}

	return &models.CommentList{
		TotalCount: totalCount,
		TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
		Page:       pq.GetPage(),
		Size:       pq.GetSize(),
		HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
		Comments:   commList,
	}, nil
}
