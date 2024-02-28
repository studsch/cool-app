package repository

import (
	"context"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/post"
	"github.com/studsch/cool-app/backend/pkg/utils"
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

// GetPosts Get all post
func (r *postRepo) GetPosts(ctx context.Context, pq *utils.PaginationQuery) (*models.PostList, error) {
	var totalCount int
	if err := r.db.QueryRow(ctx, getTotalCountQuery).Scan(&totalCount); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetPots.Scan")
	}

	if totalCount == 0 {
		return &models.PostList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
			Posts:      make([]*models.Post, 0),
		}, nil
	}

	var postsList = make([]*models.Post, 0, pq.GetSize())
	rows, err := r.db.Query(ctx, getPostsQuery, pq.GetOffset(), pq.GetLimit())
	if err != nil {
		return nil, errors.Wrap(err, "postRepo.GetPots.Query")
	}
	defer rows.Close()

	for rows.Next() {
		p := &models.Post{}
		if err := rows.Scan(p); err != nil {
			return nil, errors.Wrap(err, "postRepo.GetPosts.Scan")
		}
		postsList = append(postsList, p)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetPosts.Err")
	}

	return &models.PostList{
		TotalCount: totalCount,
		TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
		Page:       pq.GetPage(),
		Size:       pq.GetSize(),
		HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
		Posts:      postsList,
	}, err
}

// GetByUserID Get posts by user id
func (r *postRepo) GetByUserID(ctx context.Context, userID uuid.UUID, pq *utils.PaginationQuery) (*models.PostList, error) {
	var totalCount int
	if err := r.db.QueryRow(ctx, getTotalCountQuery).Scan(&totalCount); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetByUserID.Scan")
	}

	if totalCount == 0 {
		return &models.PostList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
			Posts:      make([]*models.Post, 0),
		}, nil
	}

	var postsList = make([]*models.Post, 0, pq.GetSize())
	rows, err := r.db.Query(ctx, getByUserIdQuery, userID, pq.GetOffset(), pq.GetLimit())
	if err != nil {
		return nil, errors.Wrap(err, "postRepo.GetByUserID.Query")
	}
	defer rows.Close()

	for rows.Next() {
		p := &models.Post{}
		if err := rows.Scan(p); err != nil {
			return nil, errors.Wrap(err, "postRepo.GetByUserID.Scan")
		}
		postsList = append(postsList, p)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetByUserID.Err")
	}

	return &models.PostList{
		TotalCount: totalCount,
		TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
		Page:       pq.GetPage(),
		Size:       pq.GetSize(),
		HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
		Posts:      postsList,
	}, err
}
