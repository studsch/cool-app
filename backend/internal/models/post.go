package models

import (
	"time"

	"github.com/google/uuid"
)

// Post Posts base model
type Post struct {
	CreatedAt   time.Time `json:"createdAt,omitempty" validate:"omitempty"`
	Description string    `json:"description,omitempty" validate:"required,gte=5,lte=255"`
	Location    string    `json:"location,omitempty" validate:"omitempty,gte=3,lte=127"`
	ImageURLs   []string  `json:"imageURLs,omitempty" validate:"omitempty"`
	ID          uuid.UUID `json:"id,omitempty" validate:"omitempty,uuid"`
	UserID      uuid.UUID `json:"userId,omitempty" validate:"required"`
	Archived    bool      `json:"archived,omitempty" validate:"omitempty"`
	Deleted     bool      `json:"deleted,omitempty" validate:"omitempty"`
}

// PostBase Post base
type PostBase struct {
	CreatedAt   time.Time `json:"createdAt,omitempty" validate:"omitempty"`
	Description string    `json:"description,omitempty" validate:"required,gte=5,lte=255"`
	Location    string    `json:"location,omitempty" validate:"omitempty,gte=3,lte=127"`
	Author      string    `json:"author,omitempty" validate:"omitempty"`
	ImageURLs   []string  `json:"imageURLs,omitempty" validate:"omitempty"`
	ID          uuid.UUID `json:"id,omitempty" validate:"omitempty,uuid"`
	UserID      uuid.UUID `json:"userId,omitempty" validate:"required"`
}

// PostList All Post response
type PostList struct {
	Posts      []*Post `json:"posts"`
	TotalCount int     `json:"totalCount"`
	TotalPages int     `json:"totalPages"`
	Page       int     `json:"page"`
	Size       int     `json:"size"`
	HasMore    bool    `json:"hasMore"`
}
