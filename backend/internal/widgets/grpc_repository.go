package widgets

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
)

type GrpcRepository interface {
	GetMostLikedUserInfoByUserId(context.Context, uuid.UUID) (*models.MiniUser, error)
	GetMostLikedTagByUserId(context.Context, uuid.UUID) (*models.Tag, error)
	GetMostViewedUserInfoByUserId(context.Context, uuid.UUID) (*models.MiniUser, error)
}
