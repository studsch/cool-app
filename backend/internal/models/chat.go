package models

import (
	"time"

	"github.com/google/uuid"
)

type Chat struct {
	CreatedAt time.Time
	ID        uuid.UUID
	User1ID   uuid.UUID
	User2ID   uuid.UUID
}

type Message struct {
	Time            time.Time
	Body            string
	ID              uuid.UUID
	SenderUserID    uuid.UUID
	RecipientUserID uuid.UUID
	ChatID          uuid.UUID
	ReadStatus      bool
}
