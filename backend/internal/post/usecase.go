package post

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// UseCase Post repository interface
type UseCase interface {
	Create(ctx context.Context, post *models.Post) (*models.Post, error)
	Update(ctx context.Context, post *models.Post) (*models.Post, error)
	Archive(ctx context.Context, postID uuid.UUID) error
	Delete(ctx context.Context, postID uuid.UUID) error
	GetPosts(ctx context.Context, pq *utils.PaginationQuery) (*models.PostList, error)
	GetByID(ctx context.Context, postID uuid.UUID) (*models.PostBase, error)
	GetByUserID(ctx context.Context, userID uuid.UUID, pq *utils.PaginationQuery) (*models.PostList, error)
	UploadImages(ctx context.Context, postID uuid.UUID, files []models.UploadInput) (*models.Post, error)
	GetImageURL(ctx context.Context, bucket, key string) (string, error)
	Search(ctx context.Context, tags []string, q string, pq *utils.PaginationQuery) (*models.PostList, error)
	SearchByFilter(ctx context.Context, tags []string, filter *models.PostFilter, pq *utils.PaginationQuery) (*models.PostList, error)
	AddTagByTitle(ctx context.Context, title string) (*models.Tag, error)
	GetTagsOnPost(ctx context.Context, postID uuid.UUID) ([]string, error)
}
