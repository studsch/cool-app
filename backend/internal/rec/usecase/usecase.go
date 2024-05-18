package usecase

import (
	"context"
	"fmt"
	"time"

	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/rec"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type recUC struct {
	recRepo rec.GrpcRepository
	log     logger.Logger
}

func NewRecUC(
	recRepo rec.GrpcRepository, log logger.Logger,
) rec.UseCase {
	return &recUC{
		recRepo: recRepo,
		log:     log,
	}
}

func (u *recUC) PrepareRecs() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := u.recRepo.ExecuteDataToFiles(ctx); err != nil {
		u.log.Error("execute data to file error")
		return
	}

	models := []models.RecModel{
		{
			Name:  "rs v1.1.1",
			Type:  1,
			Valid: true,
		},
		{
			Name:  "rs v1.1.2",
			Type:  2,
			Valid: true,
		},
		{
			Name:  "rs v1.1.3",
			Type:  3,
			Valid: true,
		},
		{
			Name:  "rs v1.2.1",
			Type:  1,
			Valid: false,
		},
		{
			Name:  "rs v1.2.2",
			Type:  2,
			Valid: false,
		},
		{
			Name:  "rs v1.2.3",
			Type:  3,
			Valid: false,
		},
	}

	for _, m := range models {
		// deleting existing model
		if err := u.recRepo.DeleteModelFromFiles(ctx, m.Name); err != nil {
			u.log.Errorf(
				"delete model from files, name: %s, error: %w",
				m.Name, err,
			)
		}

		// train model
		if err := u.recRepo.TrainModel(ctx, &m); err != nil {
			u.log.Errorf(
				"train model, name: %s, error: %w",
				m.Name, err,
			)
		}
	}

	// validate some models
	for i := 0; i < 3; i++ {
		if err := u.recRepo.ValidateModel(ctx, models[i].Name); err != nil {
			u.log.Errorf(
				"validate model, name: %s, error: %w",
				models[i].Name, err,
			)
		}
	}

	// set models for predict
	for i := 3; i < 6; i++ {
		if err := u.recRepo.SetModel(ctx, &models[i]); err != nil {
			u.log.Errorf(
				"set model, name: %s, error: %w",
				models[i].Name, err,
			)
		}
	}
}

func (u *recUC) PredictPostsByUserID(
	ctx context.Context,
) error {
	userCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return err
	}

	predict, err := u.recRepo.PredictPostsForOneUser(ctx, userCtx.ID)
	if err != nil {
		return err
	}

	fmt.Println(predict)
	return nil
}
