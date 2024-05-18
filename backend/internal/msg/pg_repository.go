package msg

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
)

type PSQLRepository interface {
	CreateChat(
		ctx context.Context, user1ID uuid.UUID, user2ID uuid.UUID,
	) (*models.Chat, error)
	GetChatByIDPairs(
		ctx context.Context, user1ID uuid.UUID, user2ID uuid.UUID,
	) (*models.Chat, error)
	CreateMessage(
		ctx context.Context, inMessage *models.Message,
	) (*models.Message, error)
	GetChatsByUserID(
		ctx context.Context, userID uuid.UUID,
	) ([]*models.Chat, error)
}
