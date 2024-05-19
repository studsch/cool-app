package widgets

import (
	"context"

	"github.com/studsch/cool-app/backend/internal/models"
)

type UseCase interface {
	GetWidgets(context.Context) (*models.AllWidgets, error)
}
