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
		comment.UserID, comment.PostID, comment.ReplyTo,
		comment.Content, comment.MainCommentID,
	).Scan(
		&c.ID, &c.UserID, &c.PostID, &c.ReplyTo,
		&c.Content, &c.CreatedAt, &c.MainCommentID,
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
		&c.CreatedAt, &c.Author, &c.AvatarURL, &c.MainCommentID,
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

	commList := make([]*models.CommentBase, 0, pq.GetSize())
	rows, err := r.db.Query(ctx, getAllByPostIdQuery, postID, pq.GetOffset(), pq.GetLimit())
	if err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetAllByPostID.Query")
	}
	defer rows.Close()

	for rows.Next() {
		c := &models.CommentBase{}
		if err := rows.Scan(
			&c.ID, &c.UserID, &c.PostID, &c.ReplyTo,
			&c.Content, &c.CreatedAt, &c.Author, &c.AvatarURL, &c.MainCommentID,
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

	commList := make([]*models.CommentBase, 0, pq.GetSize())
	rows, err := r.db.Query(ctx, getReplyByCommentIdQuery, commentID, pq.GetOffset(), pq.GetLimit())
	if err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetReplyByCommentID.Query")
	}
	defer rows.Close()

	for rows.Next() {
		c := &models.CommentBase{}
		if err := rows.Scan(
			&c.ID, &c.UserID, &c.PostID, &c.ReplyTo,
			&c.Content, &c.CreatedAt, &c.Author, &c.AvatarURL, &c.MainCommentID,
		); err != nil {
			return nil, errors.Wrap(err, "commentRepo.GetReplyByCommentID.Scan")
		}
		commList = append(commList, c)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetReplyByCommentID.Err")
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

func (r *commentRepo) GetCommentCountByPostID(
	ctx context.Context, postID uuid.UUID,
) (int, error) {
	query := `
SELECT COUNT(id)
FROM comment
WHERE post_id = $1 AND deleted = FALSE AND main_comment_id IS NULL
`
	var commentCount int
	if err := r.db.QueryRow(ctx, query, &postID).
		Scan(&commentCount); err != nil {
		return 0, errors.Wrap(err, "commentRepo.GetCommentCountByPostID.Scan")
	}
	return commentCount, nil
}

func (r *commentRepo) GetReplyCountByCommentID(
	ctx context.Context, commentID uuid.UUID,
) (int, error) {
	query := `
SELECT COUNT(id)
FROM comment
WHERE reply_to_comment_id = $1 AND deleted = FALSE
`
	var replyCount int
	if err := r.db.QueryRow(ctx, query, &commentID).
		Scan(&replyCount); err != nil {
		return 0, errors.Wrap(err, "commentRepo.GetReplyCountByCommentID.Scan")
	}
	return replyCount, nil
}

func (r *commentRepo) GetAllReplysByMainCommentID(
	ctx context.Context, mainCommentID uuid.UUID, pq *utils.PaginationQuery,
) (*models.CommentList, error) {
	pgQuery := `
SELECT COUNT(id)
FROM comment
WHERE main_comment_id = $1 AND deleted = FALSE
`
	var totalCount int
	if err := r.db.QueryRow(
		ctx, pgQuery, mainCommentID,
	).Scan(&totalCount); err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetAllReplysByMainCommentID.Scan")
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

	allReplysQuery := `
SELECT
	c.id, c.user_id, c.post_id, c.reply_to_comment_id, c.content,
	c.created_at, CONCAT(u.first_name, ' ', u.last_name), u.avatar,
	c.main_comment_id
FROM comment c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.main_comment_id = $1 AND c.deleted = FALSE
ORDER BY c.created_at OFFSET $2 LIMIT $3
`
	commList := make([]*models.CommentBase, 0, pq.GetSize())
	rows, err := r.db.Query(ctx, allReplysQuery, mainCommentID, pq.GetOffset(), pq.GetLimit())
	if err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetAllReplysByMainCommentID.Query")
	}
	defer rows.Close()

	for rows.Next() {
		c := &models.CommentBase{}
		if err := rows.Scan(
			&c.ID, &c.UserID, &c.PostID, &c.ReplyTo,
			&c.Content, &c.CreatedAt, &c.Author, &c.AvatarURL, &c.MainCommentID,
		); err != nil {
			return nil, errors.Wrap(err, "commentRepo.GetAllReplysByMainCommentID.Scan")
		}
		commList = append(commList, c)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "commentRepo.GetAllReplysByMainCommentID.Err")
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
