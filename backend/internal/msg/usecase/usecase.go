package usecase

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/msg"
	"github.com/studsch/cool-app/backend/internal/user"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type msgUC struct {
	cfg      *config.Config
	log      logger.Logger
	chatRepo msg.PSQLRepository
	userRepo user.Repository
}

func NewChatUC(
	cfg *config.Config, log logger.Logger, chatRepo msg.PSQLRepository,
	userRepo user.Repository,
) *msgUC {
	return &msgUC{
		cfg:      cfg,
		log:      log,
		chatRepo: chatRepo,
		userRepo: userRepo,
	}
}

func (u *msgUC) CreateChat(
	ctx context.Context, user2ID uuid.UUID,
) (*models.Chat, error) {
	userCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	user1ID := userCtx.ID
	// check chat exists (user1+user2 = user2+user1)
	// user1 + user2
	chat, err := u.GetChatByIDPairs(ctx, user1ID, user2ID)
	if err != nil {
		return nil, err
	}
	if chat != nil {
		return nil, fmt.Errorf("chat already exists")
	}

	// user2 + user1
	chat, err = u.GetChatByIDPairs(ctx, user2ID, user1ID)
	if err != nil {
		return nil, err
	}
	if chat != nil {
		return nil, fmt.Errorf("chat already exists")
	}

	friendsIDs, err := u.userRepo.GetFriendsIDs(ctx, user1ID)
	if err != nil {
		return nil, err
	}

	// check if users are friends
	var canChatting bool
	for _, f := range *friendsIDs {
		if f.ID() == user2ID.ID() {
			canChatting = true
			break
		}
	}

	if !canChatting {
		fmt.Println("you need to be friends, for chatting")
		return nil, fmt.Errorf("you need to be friends, for chatting")
	}

	out, err := u.chatRepo.CreateChat(ctx, user1ID, user2ID)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (u *msgUC) GetChatByIDPairs(
	ctx context.Context, user1ID uuid.UUID, user2ID uuid.UUID,
) (*models.Chat, error) {
	out, err := u.chatRepo.GetChatByIDPairs(ctx, user1ID, user2ID)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (u *msgUC) CreateMessage(
	ctx context.Context, inMessage *models.Message,
) (*models.Message, error) {
	return u.chatRepo.CreateMessage(ctx, inMessage)
}

func (u *msgUC) GetChatsByUserID(
	ctx context.Context,
) ([]*models.Chat, error) {
	userCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, err
	}

	return u.chatRepo.GetChatsByUserID(ctx, userCtx.ID)
}
