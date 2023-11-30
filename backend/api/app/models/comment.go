package models

import (
	"time"

	"github.com/google/uuid"
)

type Comment struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	PostID    uuid.UUID
	Content   string
	CreatedAt time.Time
	Deleted   bool
}

type Reply struct {
	ID               uuid.UUID
	UserID           uuid.UUID
	PostID           uuid.UUID
	ReplyToCommentID uuid.UUID
	Content          string
	CreatedAt        time.Time
	Deleted          bool
}
