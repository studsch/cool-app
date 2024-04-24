package msg

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
)

type UseCase interface {
	CreateChat(
		ctx context.Context, user1ID uuid.UUID, user2ID uuid.UUID,
	) (*models.Chat, error)
	GetChatByIDPairs(
		ctx context.Context, user1ID uuid.UUID, user2ID uuid.UUID,
	) (*models.Chat, error)
}
