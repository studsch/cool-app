package repository

import (
	"context"
	"encoding/json"
	"time"

	"github.com/pkg/errors"
	"github.com/redis/go-redis/v9"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/post"
)

type postRedisRepo struct {
	redisClient *redis.Client
}

func NewPostRedisRepo(rc *redis.Client) post.RedisRepository {
	return &postRedisRepo{
		redisClient: rc,
	}
}

func (p *postRedisRepo) GetPostByIDCtx(
	ctx context.Context, key string,
) (*models.Post, error) {
	postBytes, err := p.redisClient.Get(ctx, key).Bytes()
	if err != nil {
		return nil, errors.Wrap(err, "postRedisRepo.GetPostByIDCtx.Get")
	}
	post := &models.Post{}
	if err = json.Unmarshal(postBytes, post); err != nil {
		return nil, errors.Wrap(err, "postRedisRepo.GetPostByIDCtx.json.Unmarshal")
	}

	return post, nil
}

func (p *postRedisRepo) SetPostByIDCtx(
	ctx context.Context, key string, seconds int, post *models.Post,
) error {
	postBytes, err := json.Marshal(post)
	if err != nil {
		return errors.Wrap(err, "postRedisRepo.SetPostByIDCtx.json.Marshal")
	}
	if err = p.redisClient.Set(ctx, key, postBytes, time.Second*time.Duration(seconds)).Err(); err != nil {
		return errors.Wrap(err, "postRedisRepo.SetPostByIDCtx.redisClient.Set")
	}

	return nil
}

func (p *postRedisRepo) DeletePostByIDCtx(
	ctx context.Context, key string,
) error {
	if err := p.redisClient.Del(ctx, key).Err(); err != nil {
		return errors.Wrap(err, "postRedisRepo.DeletePostByIDCtx.redisClient.Del")
	}

	return nil
}
