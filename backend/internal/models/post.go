package models

import (
	"github.com/google/uuid"
	"time"
)

type Post struct {
	ID          uuid.UUID `json:"id,omitempty" validate:"omitempty,uuid"`
	UserID      uuid.UUID `json:"userId,omitempty" validate:"required"`
	Description string    `json:"description,omitempty" validate:"required,gte=5,lte=255"`
	Location    string    `json:"location,omitempty" validate:"omitempty,gte=3,lte=127"`
	CreatedAt   time.Time `json:"createdAt,omitempty" validate:"omitempty"`
	ImageURLs   []string  `json:"imageURLs,omitempty" validate:"omitempty"`
	Archived    bool      `json:"archived,omitempty" validate:"omitempty"`
	Deleted     bool      `json:"deleted,omitempty" validate:"omitempty"`
}
