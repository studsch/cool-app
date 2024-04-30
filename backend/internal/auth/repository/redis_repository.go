package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/pkg/errors"
	"github.com/redis/go-redis/v9"

	"github.com/studsch/cool-app/backend/internal/auth"
)

type authRedisRepo struct {
	redisClient *redis.Client
}

func NewAuthRedisRepo(rc *redis.Client) auth.RedisRepository {
	return &authRedisRepo{
		redisClient: rc,
	}
}

func (a *authRedisRepo) SetRefreshToken(
	ctx context.Context, key string, refreshToken string, seconds int,
) error {
	if err := a.redisClient.Set(
		ctx, key, refreshToken, time.Second*time.Duration(seconds),
	).Err(); err != nil {
		return errors.Wrap(err, "authRedisRepo.SetRefreshToken.redisClient.Set")
	}

	return nil
}

func (a *authRedisRepo) DeleteRefreshToken(
	ctx context.Context, key string,
) error {
	if err := a.redisClient.Del(ctx, key).Err(); err != nil {
		return errors.Wrap(
			err, "authRedisRepo.DeleteRefreshToken.redisClient.Del",
		)
	}

	return nil
}

func (a *authRedisRepo) GetRefreshTokenByID(
	ctx context.Context, key string,
) (*string, error) {
	tokenBytes, err := a.redisClient.Get(ctx, key).Bytes()
	if err != nil {
		fmt.Println("can't get refresh token from REDIS")
		return nil, errors.Wrap(err, "postRedisRepo.GetPostByIDCtx.Get")
	}
	refreshToken := string(tokenBytes)
	fmt.Println("refreshToken from REDIS", refreshToken)

	return &refreshToken, nil
}
