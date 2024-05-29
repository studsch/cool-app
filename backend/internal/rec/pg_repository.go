package rec

import (
	"context"

	"github.com/studsch/cool-app/backend/internal/models"
)

type Repository interface {
	GetPostsByIDs(
		ctx context.Context, ids []string,
	) ([]models.Post, error)
}
