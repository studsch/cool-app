package rec

import (
	"context"

	"github.com/studsch/cool-app/backend/internal/models"
)

type UseCase interface {
	PrepareRecs()
	PredictPostsByUserID(ctx context.Context) (models.OutRecMap, error)
}
