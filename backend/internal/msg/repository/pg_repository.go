package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
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
	).Scan(&chat.ID, &chat.User1ID, &chat.User2ID, &chat.CreatedAt); err != nil {
		fmt.Println(err)
		return nil, errors.Wrap(err, "msgRepo.CreateChat.Scan")
	}

	return &chat, nil
}
