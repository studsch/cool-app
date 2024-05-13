package models

import "github.com/google/uuid"

type Tag struct {
	Title string    `json:"title" validate:"omitempty"`
	ID    uuid.UUID `json:"id" validate:"omitempty"`
}

type PostTag struct {
	ID     uuid.UUID `json:"id" validate:"omitempty"`
	PostID uuid.UUID `json:"postId" validate:"omitempty"`
	TagID  uuid.UUID `json:"tagId" validate:"omitempty"`
}
