package models

import (
	"time"

	"github.com/google/uuid"
)

type Post struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	Description string
	Location    string
	CreatedAt   time.Time
	Archived    bool
	Deleted     bool
}
