package models

import "github.com/google/uuid"

type Tag struct {
	Title string
	ID    uuid.UUID
}

type PostTag struct {
	ID     uuid.UUID
	PostID uuid.UUID
	TagID  uuid.UUID
}
