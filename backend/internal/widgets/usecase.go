package widgets

import (
	"context"

	"github.com/studsch/cool-app/backend/internal/models"
)

type UseCase interface {
	GetWidgets(ctx context.Context, city, country string) (*models.AllWidgets, error)
}
