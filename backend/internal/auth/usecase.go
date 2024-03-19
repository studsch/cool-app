package auth

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// UseCase Auth repository interface
type UseCase interface {
	Register(ctx context.Context, user *models.User) (*models.UserWithTokens, error)
	GetByID(ctx context.Context, userID uuid.UUID) (*models.User, error)
	Login(ctx context.Context, user *models.User) (*models.UserWithTokens, error)
	UploadAvatar(ctx context.Context, userID uuid.UUID, file models.UploadInput) (*models.User, error)
	Search(ctx context.Context, q string, pq *utils.PaginationQuery) (*models.UserList, error)
}
