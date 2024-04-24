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
