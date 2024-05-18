package rec

import (
	"context"
)

type UseCase interface {
	PrepareRecs()
	PredictPostsByUserID(context.Context) error
}
