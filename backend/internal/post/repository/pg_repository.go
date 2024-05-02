package repository

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
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

func (r *postRepo) queryRowsWithFilter(
	ctx context.Context, query string, tags []string, filter *models.PostFilter,
	useP bool,
) (pgx.Rows, error) {
	var filterValues []interface{}

	filterValues = append(filterValues, tags)
	filterValues = append(filterValues, filter.Q)

	createdAt := "created_at"
	if useP {
		createdAt = "p.created_at"
	}

	query += `WHERE importance > 0.3 AND deleted = FALSE AND archived = FALSE `

	if filter.Location != "" {
		filterValues = append(filterValues, filter.Location)
		query += `AND location = $` + strconv.Itoa(len(filterValues)) + " "
	}
	if !filter.CreatedAt.IsZero() {
		filterValues = append(filterValues, filter.CreatedAt)
		query += fmt.Sprintf(
			"AND %s >= $%s ", createdAt,
			strconv.Itoa(len(filterValues)),
		)
		// query += `AND p.created_at >= $` + strconv.Itoa(len(filterValues)) + " "
	}

	switch filter.OrderBy {
	case "-":
		query += ``
	case "date":
		query += fmt.Sprintf("ORDER BY %s DESC ", createdAt)
		// query += `ORDER BY p.created_at DESC `
	case "rate":
		// TODO: add this
		query += `ORDER BY importance DESC `
	default:
		query += `ORDER BY importance DESC `
	}

	if filter.Offset != 0 {
		filterValues = append(filterValues, filter.Offset)
		query += `OFFSET $` + strconv.Itoa(len(filterValues)) + " "
	}
	if filter.Limit != 0 {
		filterValues = append(filterValues, filter.Limit)
		query += `LIMIT $` + strconv.Itoa(len(filterValues)) + " "
	}

	return r.db.Query(ctx, query, filterValues...)
}

func (r *postRepo) SearchByFilter(
	ctx context.Context, tags []string, filter *models.PostFilter,
	pq *utils.PaginationQuery,
) (*models.PostList, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var totalCount int
	rowsC, err := r.queryRowsWithFilter(
		ctx, searchByFilterGetTotalCountQuery, tags, &models.PostFilter{
			CreatedAt: filter.CreatedAt,
			Q:         filter.Q,
			OrderBy:   "-",
			Location:  filter.Location,
			Offset:    0,
			Limit:     0,
		}, false,
	)
	if err != nil {
		return nil, err
	}
	defer rowsC.Close()
	for rowsC.Next() {
		if err := rowsC.Scan(&totalCount); err != nil {
			return nil, errors.Wrap(err, "postRepo.SearchByFilter.Scan")
		}
	}
	if err := rowsC.Err(); err != nil {
		return nil, errors.Wrap(err, "postRepo.SearchByFilter.Err")
	}

	if totalCount == 0 {
		return &models.PostList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore: utils.GetHasMore(
				pq.GetPage(), totalCount, pq.GetSize(),
			),
			Posts: make([]*models.Post, 0),
		}, nil
	}

	filter.Offset = uint64(pq.GetOffset())
	filter.Limit = uint64(pq.GetSize())

	rows, err := r.queryRowsWithFilter(
		ctx, searchByFilterPostQuery, tags, filter, true,
	)
	if err != nil {
		return nil, err
	}

	postsList := make([]*models.Post, 0, filter.Limit)
	defer rows.Close()
	for rows.Next() {
		p := &models.Post{}
		if err := rows.Scan(
			&p.ID, &p.UserID, &p.Description, &p.Location,
			&p.CreatedAt, &p.ImageURLs,
			&p.Deleted, &p.Archived,
			&p.UserFirstName, &p.UserLastName, &p.UserLogin,
			&p.UserAvatar,
		); err != nil {
			return nil, errors.Wrap(err, "postRepo.Search.Scan")
		}
		postsList = append(postsList, p)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "postRepo.SearchByFilter.Err")
	}

	return &models.PostList{
		TotalCount: totalCount,
		TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
		Page:       pq.GetPage(),
		Size:       pq.GetSize(),
		HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
		Posts:      postsList,
	}, nil
}

// Create Creates new post
func (r *postRepo) Create(ctx context.Context, post *models.Post) (
	*models.Post, error,
) {
	var p models.Post
	if err := r.db.QueryRow(
		ctx, createPostQuery,
		&post.UserID, &post.Description, &post.Location, &post.ImageURLs,
		false, false,
	).Scan(
		&p.ID, &p.UserID, &p.Description, &p.Location,
		&p.CreatedAt, &p.ImageURLs,
	); err != nil {
		return nil, errors.Wrap(err, "postRepo.Create.Scan")
	}

	return &p, nil
}

// Update Updates post
func (r *postRepo) Update(ctx context.Context, post *models.Post) (
	*models.Post, error,
) {
	var p models.Post
	if err := r.db.QueryRow(
		ctx, updatePostQuery,
		&post.Description, &post.Location, &post.ImageURLs, &post.ID,
	).Scan(
		&p.ID, &p.UserID, &p.Description, &p.Location,
		&p.CreatedAt, &p.ImageURLs,
	); err != nil {
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
		return errors.Wrap(
			errors.New("post with id not found"), "postRepo.Archive",
		)
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
		return errors.Wrap(
			errors.New("post with id not found"), "postRepo.Delete",
		)
	}

	return nil
}

// GetByID Get post by id
func (r *postRepo) GetByID(
	ctx context.Context, postID uuid.UUID,
) (*models.PostBase, error) {
	var p models.PostBase
	if err := r.db.QueryRow(ctx, getByIdQuery, postID).Scan(
		&p.ID, &p.UserID, &p.Description, &p.Location,
		&p.CreatedAt, &p.ImageURLs, &p.UserFirstName, &p.UserLastName,
		&p.UserLogin, &p.UserAvatar,
	); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetByID.Scan")
	}

	return &p, nil
}

// GetPosts Get all post
func (r *postRepo) GetPosts(
	ctx context.Context, pq *utils.PaginationQuery,
) (*models.PostList, error) {
	var totalCount int
	if err := r.db.QueryRow(
		ctx, getTotalCountQuery,
	).Scan(&totalCount); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetPots.Scan")
	}

	if totalCount == 0 {
		return &models.PostList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore: utils.GetHasMore(
				pq.GetPage(), totalCount, pq.GetSize(),
			),
			Posts: make([]*models.Post, 0),
		}, nil
	}

	postsList := make([]*models.Post, 0, pq.GetSize())
	rows, err := r.db.Query(ctx, getPostsQuery, pq.GetOffset(), pq.GetLimit())
	if err != nil {
		return nil, errors.Wrap(err, "postRepo.GetPots.Query")
	}
	defer rows.Close()

	for rows.Next() {
		p := &models.Post{}
		if err := rows.Scan(
			&p.ID, &p.UserID, &p.Description, &p.Location,
			&p.CreatedAt, &p.ImageURLs, &p.UserFirstName, &p.UserLastName,
			&p.UserLogin, &p.UserAvatar,
		); err != nil {
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
func (r *postRepo) GetByUserID(
	ctx context.Context, userID uuid.UUID, pq *utils.PaginationQuery,
) (*models.PostList, error) {
	var totalCount int
	if err := r.db.QueryRow(
		ctx, getTotalCountQuery,
	).Scan(&totalCount); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetByUserID.Scan")
	}

	if totalCount == 0 {
		return &models.PostList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore: utils.GetHasMore(
				pq.GetPage(), totalCount, pq.GetSize(),
			),
			Posts: make([]*models.Post, 0),
		}, nil
	}

	postsList := make([]*models.Post, 0, pq.GetSize())
	rows, err := r.db.Query(
		ctx, getByUserIdQuery, userID, pq.GetOffset(), pq.GetLimit(),
	)
	if err != nil {
		return nil, errors.Wrap(err, "postRepo.GetByUserID.Query")
	}
	defer rows.Close()

	for rows.Next() {
		p := &models.Post{}
		if err := rows.Scan(
			&p.ID, &p.UserID, &p.Description, &p.Location,
			&p.CreatedAt, &p.ImageURLs, &p.UserFirstName, &p.UserLastName,
			&p.UserLogin, &p.UserAvatar,
		); err != nil {
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

func (r *postRepo) Search(
	ctx context.Context, tags []string, q string, pq *utils.PaginationQuery,
) (*models.PostList, error) {
	var totalCount int
	if err := r.db.QueryRow(
		ctx, searchGetTotalCountQuery, tags, q,
	).Scan(&totalCount); err != nil {
		return nil, errors.Wrap(err, "postRepo.Search.Scan")
	}

	if totalCount == 0 {
		return &models.PostList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore: utils.GetHasMore(
				pq.GetPage(), totalCount, pq.GetSize(),
			),
			Posts: make([]*models.Post, 0),
		}, nil
	}

	postsList := make([]*models.Post, 0, pq.GetSize())
	rows, err := r.db.Query(
		ctx, searchPostQuery, tags, q, pq.GetOffset(), pq.GetLimit(),
	)
	if err != nil {
		return nil, errors.Wrap(err, "postRepo.Search.Query")
	}
	defer rows.Close()

	for rows.Next() {
		p := &models.Post{}
		if err := rows.Scan(
			&p.ID, &p.UserID, &p.Description, &p.Location,
			&p.CreatedAt, &p.ImageURLs,
		); err != nil {
			return nil, errors.Wrap(err, "postRepo.Search.Scan")
		}
		postsList = append(postsList, p)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "postRepo.Search.Err")
	}

	return &models.PostList{
		TotalCount: totalCount,
		TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
		Page:       pq.GetPage(),
		Size:       pq.GetSize(),
		HasMore:    utils.GetHasMore(pq.GetPage(), totalCount, pq.GetSize()),
		Posts:      postsList,
	}, nil
}

func (r *postRepo) GetTagByTitle(
	ctx context.Context, title string,
) (*models.Tag, error) {
	var t models.Tag

	if err := r.db.QueryRow(ctx, getTagByTitle, title).Scan(
		&t.ID, &t.Title,
	); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "postRepo.GetTagByTitle.Scan")
	}

	return &t, nil
}

func (r *postRepo) CreateTag(ctx context.Context, title string) (
	*models.Tag, error,
) {
	var t models.Tag

	if err := r.db.QueryRow(ctx, createTag, title).Scan(
		&t.ID, &t.Title,
	); err != nil {
		return nil, errors.Wrap(err, "postRepo.CreateTag.Scan")
	}

	return &t, nil
}

func (r *postRepo) CreatePostTag(
	ctx context.Context, postID uuid.UUID, tagID uuid.UUID,
) (*models.PostTag, error) {
	var postTag models.PostTag

	if err := r.db.QueryRow(ctx, createPostTag, postID, tagID).Scan(
		&postTag.ID, &postTag.PostID, &postTag.TagID,
	); err != nil {
		return nil, errors.Wrap(err, "postRepo.CreatePostTag.Scan")
	}

	return &postTag, nil
}

func (r *postRepo) GetTagsOnPost(
	ctx context.Context, postID uuid.UUID,
) ([]string, error) {
	var tags []string

	rows, err := r.db.Query(ctx, getTagsOnPost, postID)
	if err != nil {
		return nil, errors.Wrap(err, "postRepo.GetTagsOnPost.Query")
	}
	defer rows.Close()

	for rows.Next() {
		var tag string
		if err := rows.Scan(&tag); err != nil {
			if err == pgx.ErrNoRows {
				return nil, nil
			}
			return nil, errors.Wrap(err, "postRepo.GetTagsOnPost.Scan")
		}
		tags = append(tags, tag)
	}

	if err := rows.Err(); err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}

		return nil, errors.Wrap(err, "postRepo.GetTagsOnPost.Err")
	}

	return tags, nil
}

func (r *postRepo) GetLikedPostsByUserID(
	ctx context.Context, userID uuid.UUID, pq *utils.PaginationQuery,
) (*models.PostList, error) {
	var totalCount int
	if err := r.db.QueryRow(
		ctx, getTotalCountLikedPostsByUserID, &userID,
	).Scan(&totalCount); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetLikedPostsByUserID.Scan")
	}

	if totalCount == 0 {
		return &models.PostList{
			TotalCount: totalCount,
			TotalPages: utils.GetTotalPages(totalCount, pq.GetSize()),
			Page:       pq.GetPage(),
			Size:       pq.GetSize(),
			HasMore: utils.GetHasMore(
				pq.GetPage(), totalCount, pq.GetSize(),
			),
			Posts: make([]*models.Post, 0),
		}, nil
	}

	postsList := make([]*models.Post, 0, pq.GetSize())
	rows, err := r.db.Query(
		ctx, getLikedPostsByUserID, userID, pq.GetOffset(), pq.GetLimit(),
	)
	if err != nil {
		return nil, errors.Wrap(err, "postRepo.GetLikedPostsByUserID.Query")
	}
	defer rows.Close()

	for rows.Next() {
		p := &models.Post{}
		if err := rows.Scan(
			&p.ID, &p.UserID, &p.Description, &p.Location,
			&p.CreatedAt, &p.ImageURLs, &p.UserFirstName,
			&p.UserLastName, &p.UserLogin, &p.UserAvatar,
		); err != nil {
			return nil, errors.Wrap(err, "postRepo.GetLikedPostsByUserID.Scan")
		}
		postsList = append(postsList, p)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "postRepo.GetLikedPostsByUserID.Err")
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

func (r *postRepo) CheckLikeOnPostByID(
	ctx context.Context, userID uuid.UUID, postID uuid.UUID,
) (bool, error) {
	query := `
SELECT EXISTS(
SELECT 1 FROM like_post
WHERE user_id = $1 AND post_id = $2
)
`
	var out bool
	if err := r.db.QueryRow(
		ctx, query, &userID, &postID,
	).Scan(&out); err != nil {
		return false, errors.Wrap(err, "postRepo.CheckLikeOnPostByID.Scan")
	}
	return out, nil

}

func (r *postRepo) SavePostViewed(
	ctx context.Context, userID uuid.UUID, postID uuid.UUID,
) error {
	query := `
INSERT INTO viewed_posts (
    id, user_id, post_id, view_count
) VALUES (
    DEFAULT, $1, $2, DEFAULT
) RETURNING id
`
	var viewID uuid.UUID
	if err := r.db.QueryRow(
		ctx, query, &userID, &postID,
	).Scan(&viewID); err != nil {
		return errors.Wrap(err, "postRepo.SavePostViewed.Scan")
	}
	return nil
}
