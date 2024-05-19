package usecase

import (
	"context"

	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/widgets"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type widgetsUC struct {
	widgetsRepo widgets.GrpcRepository
	log         logger.Logger
}

func NewWidgetsUC(
	widgetsRepo widgets.GrpcRepository, log logger.Logger,
) widgets.UseCase {
	return &widgetsUC{
		widgetsRepo: widgetsRepo,
		log:         log,
	}
}

func (u *widgetsUC) GetWidgets(
	ctx context.Context,
) (*models.AllWidgets, error) {
	userCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	userID := userCtx.ID

	u1, err := u.widgetsRepo.GetMostLikedUserInfoByUserId(ctx, userID)
	if err != nil {
		u.log.Error(err)
	}
	u2, err := u.widgetsRepo.GetMostViewedUserInfoByUserId(ctx, userID)
	if err != nil {
		u.log.Error(err)
	}
	t, err := u.widgetsRepo.GetMostLikedTagByUserId(ctx, userID)
	if err != nil {
		u.log.Error(err)
	}

	allWidgets := &models.AllWidgets{
		MostLikedUserInfo:  u1,
		MostViewedUserInfo: u2,
		MostLikedTag:       t,
	}

	return allWidgets, nil
}
