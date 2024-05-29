package rec

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
)

type GrpcRepository interface {
	ExecuteDataToFiles(context.Context) error
	DeleteModelFromFiles(context.Context, string) error
	TrainModel(context.Context, *models.RecModel) error
	ValidateModel(context.Context, string) error
	SetModel(context.Context, *models.RecModel) error
	PredictPostsForOneUser(context.Context, uuid.UUID) (models.DataMap, error)
}
