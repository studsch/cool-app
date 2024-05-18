package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"

	"github.com/studsch/cool-app/backend/internal/models"
)

var messagesSize = 30

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
		&chat.ID, &chat.User1ID, &chat.User2.ID, &chat.CreatedAt,
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
		&chat.ID, &chat.User1ID, &chat.User2.ID, &chat.CreatedAt,
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
	id, chat_id, sender_id, body, time
) VALUES (
	DEFAULT, $1, $2, $3, DEFAULT
) RETURNING id, chat_id, sender_id, body, time
`
	outMessage := &models.Message{}

	if err := r.db.QueryRow(
		ctx, query, &inMessage.ChatID, &inMessage.SenderID, &inMessage.Body,
	).Scan(
		&outMessage.ID, &outMessage.ChatID, &outMessage.SenderID,
		&outMessage.Body, &outMessage.Time,
	); err != nil {
		return nil, errors.Wrap(err, "msgRepo.CreateMessage.Scan")
	}

	return outMessage, nil
}

func (r *msgRepo) GetMessages(
	ctx context.Context, chatID uuid.UUID, lastMsgTime time.Time,
) ([]*models.Message, error) {
	query := `
SELECT id, chat_id, sender_id, body, time
FROM messages
WHERE chat_id = $1 AND time < $2
ORDER BY time DESC LIMIT $3;
`

	rows, err := r.db.Query(ctx, query, chatID, lastMsgTime, messagesSize)
	if err != nil {
		return nil, errors.Wrap(err, "msgRepo.GetMessages.Query")
	}
	defer rows.Close()

	msgsList := make([]*models.Message, 0)

	for rows.Next() {
		m := &models.Message{}
		if err := rows.Scan(
			&m.ID, &m.ChatID, &m.SenderID, &m.Body, &m.Time,
		); err != nil {
			return nil, errors.Wrap(err, "msgRepo.GetMessages.Scan")
		}
		msgsList = append(msgsList, m)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "msgRepo.GetMessages.Err")
	}

	return msgsList, nil
}

func (r *msgRepo) GetChatsByUserID(
	ctx context.Context, userID uuid.UUID,
) ([]*models.Chat, error) {
	query := `
SELECT c.id, c.user1_id, u.id AS user2_id, u.login,
	u.first_name, u.last_name, u.avatar, c.created_at
FROM chats AS c
LEFT JOIN users u ON c.user2_id = u.id
WHERE c.user1_id = $1
`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, errors.Wrap(err, "msgRepo.GetChatByUserID.Query")
	}
	defer rows.Close()

	chatsList := make([]*models.Chat, 0)

	for rows.Next() {
		c := &models.Chat{}
		if err := rows.Scan(
			&c.ID, &c.User1ID, &c.User2.ID, &c.User2.Login,
			&c.User2.FirstName, &c.User2.LastName,
			&c.User2.Avatar, &c.CreatedAt,
		); err != nil {
			return nil, errors.Wrap(err, "msgRepo.GetChatByUserID.Scan")
		}
		chatsList = append(chatsList, c)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(err, "msgRepo.GetChatByUserID.Err")
	}

	return chatsList, nil
}

func (r *msgRepo) GetChatByID(
	ctx context.Context, chatID uuid.UUID,
) (*models.Chat, error) {
	query := `
SELECT c.id, c.user1_id, u.id AS user2_id, u.login,
	u.first_name, u.last_name, u.avatar, c.created_at
FROM chats AS c
LEFT JOIN users u ON c.user2_id = u.id
WHERE c.id = $1
`
	var chat models.Chat

	if err := r.db.QueryRow(
		ctx, query, chatID,
	).Scan(
		&chat.ID, &chat.User1ID, &chat.User2.ID, &chat.User2.Login,
		&chat.User2.FirstName, &chat.User2.LastName,
		&chat.User2.Avatar, &chat.CreatedAt,
	); err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}

		return nil, errors.Wrap(err, "msgRepo.GetChatByIDPairs.Scan")
	}

	return &chat, nil
}
