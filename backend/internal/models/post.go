package models

import (
	"github.com/google/uuid"
	"time"
)

// Post Posts base model
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

// PostBase Post base
type PostBase struct {
	ID          uuid.UUID `json:"id,omitempty" validate:"omitempty,uuid"`
	UserID      uuid.UUID `json:"userId,omitempty" validate:"required"`
	Description string    `json:"description,omitempty" validate:"required,gte=5,lte=255"`
	Location    string    `json:"location,omitempty" validate:"omitempty,gte=3,lte=127"`
	CreatedAt   time.Time `json:"createdAt,omitempty" validate:"omitempty"`
	ImageURLs   []string  `json:"imageURLs,omitempty" validate:"omitempty"`
	Author      string    `json:"author,omitempty" validate:"omitempty"`
}

// PostList All Post response
type PostList struct {
	TotalCount int     `json:"totalCount"`
	TotalPages int     `json:"totalPages"`
	Page       int     `json:"page"`
	Size       int     `json:"size"`
	HasMore    bool    `json:"hasMore"`
	Posts      []*Post `json:"posts"`
}
