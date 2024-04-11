package post

import (
	"context"

	"github.com/google/uuid"

	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// Repository Post repository interface
type Repository interface {
	Create(ctx context.Context, post *models.Post) (*models.Post, error)
	Update(ctx context.Context, post *models.Post) (*models.Post, error)
	Archive(ctx context.Context, postID uuid.UUID) error
	Delete(ctx context.Context, postID uuid.UUID) error
	GetByID(ctx context.Context, postID uuid.UUID) (*models.PostBase, error)
	GetPosts(ctx context.Context, pq *utils.PaginationQuery) (
		*models.PostList, error,
	)
	GetByUserID(
		ctx context.Context, userID uuid.UUID, pq *utils.PaginationQuery,
	) (*models.PostList, error)
	Search(
		ctx context.Context, tags []string, q string, pq *utils.PaginationQuery,
	) (*models.PostList, error)
	SearchByFilter(
		ctx context.Context, tags []string, filter *models.PostFilter,
		pq *utils.PaginationQuery,
	) (*models.PostList, error)
	GetTagByTitle(ctx context.Context, title string) (*models.Tag, error)
	CreateTag(ctx context.Context, title string) (*models.Tag, error)
	CreatePostTag(
		ctx context.Context, postID uuid.UUID, tagID uuid.UUID,
	) (*models.PostTag, error)
	GetTagsOnPost(ctx context.Context, postID uuid.UUID) ([]string, error)
	GetLikedPostsByUserID(
		ctx context.Context, userID uuid.UUID, pq *utils.PaginationQuery,
	) (*models.PostList, error)
}
