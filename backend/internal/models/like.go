package models

import "github.com/google/uuid"

type LikePost struct {
	ID     uuid.UUID `json:"id,omitempty" validate:"omitempty"`
	UserID uuid.UUID `json:"userId,omitempty" validate:"required"`
	PostID uuid.UUID `json:"postId,omitempty" validate:"required"`
}

type LikeComment struct {
	ID        uuid.UUID `json:"id,omitempty" validate:"omitempty"`
	UserID    uuid.UUID `json:"userId,omitempty" validate:"required"`
	CommentID uuid.UUID `json:"commentId,omitempty" validate:"required"`
}
