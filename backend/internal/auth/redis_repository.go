package auth

import "context"

type RedisRepository interface {
	SetRefreshToken(ctx context.Context, key string, refreshToken string, seconds int) error
	DeleteRefreshToken(ctx context.Context, key string) error
	GetRefreshTokenByID(ctx context.Context, key string) (*string, error)
}
