package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"

	"github.com/studsch/cool-app/backend/internal/models"
)

type msgRepo struct {
	db *pgxpool.Pool
}

func NewPsqlRepo(db *pgxpool.Pool) *msgRepo {
	return &msgRepo{db: db}
}

func (r *msgRepo) CreateChat(
	ctx context.Context, user1ID uuid.UUID, user2ID uuid.UUID,
) (*models.Chat, error) {
	query := `
INSERT INTO chats(
	id, user1_id, user2_id, created_at
) VALUES (
	default, $1, $2, default
) RETURNING
	id, user1_id, user2_id, created_at
`
	var chat models.Chat

	if err := r.db.QueryRow(
		ctx, query, user1ID, user2ID,
	).Scan(
		&chat.ID, &chat.User1ID, &chat.User2ID, &chat.CreatedAt,
	); err != nil {
		return nil, errors.Wrap(err, "msgRepo.CreateChat.Scan")
	}

	return &chat, nil
}

func (r *msgRepo) GetChatByIDPairs(
	ctx context.Context, user1ID uuid.UUID, user2ID uuid.UUID,
) (*models.Chat, error) {
	query := `
SELECT id, user1_id, user2_id, created_at
FROM chats
WHERE user1_id = $1 AND user2_id = $2;
`
	var chat models.Chat

	if err := r.db.QueryRow(
		ctx, query, user1ID, user2ID,
	).Scan(
		&chat.ID, &chat.User1ID, &chat.User2ID, &chat.CreatedAt,
	); err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}

		return nil, errors.Wrap(err, "msgRepo.GetChatByIDPairs.Scan")
	}

	return &chat, nil
}

func (r *msgRepo) CreateMessage(
	ctx context.Context, inMessage *models.Message,
) (*models.Message, error) {
	query := `
INSERT INTO messages(
	id, body, read_status, sender_user_id, recipient_user_id, chat_id, time
) VALUES (
	DEFAULT, $1, DEFAULT, $2, $3, $4, DEFAULT
)
`
	var outMessage models.Message

	if err := r.db.QueryRow(
		ctx, query, &inMessage.Body, &inMessage.SenderUserID,
		&inMessage.RecipientUserID, &inMessage.ChatID,
	).Scan(); err != nil {
		return nil, errors.Wrap(err, "msgRepo.CreateMessage.Scan")
	}

	return &outMessage, nil
}

// TODO: pagination for messages and chats
// TODO: need model for list of messages and chats
// TODO: pagination want be last 30 message after `date`
func (r *msgRepo) GetMessages(
	ctx context.Context, chatID uuid.UUID,
) (interface{}, interface{}) {
	return nil, nil
}

func (r *msgRepo) GetChatIDsByUserID(
	ctx context.Context, userID uuid.UUID,
) {
}
