package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/msg"
	"github.com/studsch/cool-app/backend/pkg/logger"
)

type msgUC struct {
	cfg      *config.Config
	log      logger.Logger
	chatRepo msg.PSQLRepository
}

func NewChatUC(
	cfg *config.Config, log logger.Logger, chatRepo msg.PSQLRepository,
) *msgUC {
	return &msgUC{
		cfg:      cfg,
		log:      log,
		chatRepo: chatRepo,
	}
}

func (u *msgUC) CreateChat(
	ctx context.Context, user1ID uuid.UUID, user2ID uuid.UUID,
) (*models.Chat, error) {
	newChat, err := u.chatRepo.CreateChat(ctx, user1ID, user2ID)
	if err != nil {
		return nil, err
	}
	return newChat, nil
}
