package auth

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// Repository Auth repository interface
type Repository interface {
	Register(ctx context.Context, user *models.User) (*models.User, error)
	FindByLogin(ctx context.Context, user *models.User) (*models.User, error)
	FindByPhoneNumber(ctx context.Context, user *models.User) (*models.User, error)
	GetByID(ctx context.Context, userID uuid.UUID) (*models.User, error)
	Update(ctx context.Context, user *models.User) (*models.User, error)
	Search(ctx context.Context, q string, pq *utils.PaginationQuery) (*models.UserList, error)
}
