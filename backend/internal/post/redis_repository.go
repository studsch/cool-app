package post

import (
	"context"

	"github.com/studsch/cool-app/backend/internal/models"
)

type RedisRepository interface {
	GetPostByIDCtx(ctx context.Context, key string) (*models.Post, error)
	SetPostByIDCtx(ctx context.Context, key string, seconds int, post *models.Post) error
	DeletePostByIDCtx(ctx context.Context, key string) error
}
