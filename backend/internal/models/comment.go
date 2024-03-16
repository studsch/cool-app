package models

import (
	"github.com/google/uuid"
	"time"
)

// Comment Comment base model
type Comment struct {
	ID        uuid.UUID `json:"id,omitempty" validate:"omitempty"`
	UserID    uuid.UUID `json:"userId,omitempty" validate:"required"`
	PostID    uuid.UUID `json:"postId,omitempty" validate:"required"`
	ReplyTo   uuid.UUID `json:"replyTo,omitempty"`
	Content   string    `json:"content,omitempty" validate:"required,gte=1,lte=255"`
	CreatedAt time.Time `json:"createdAt,omitempty" validate:"omitempty"`
	Deleted   bool      `json:"deleted,omitempty" validate:"omitempty"`
}

// CommentBase Base comment response
type CommentBase struct {
	ID        uuid.UUID `json:"id,omitempty" validate:"omitempty"`
	UserID    uuid.UUID `json:"userId,omitempty" validate:"required"`
	PostID    uuid.UUID `json:"postId,omitempty" validate:"required"`
	ReplyTo   uuid.UUID `json:"replyTo,omitempty" validate:"omitempty"`
	Content   string    `json:"content,omitempty" validate:"required,gte=1,lte=255"`
	CreatedAt time.Time `json:"createdAt,omitempty" validate:"omitempty"`
	Author    string    `json:"author,omitempty" validate:"omitempty"`
	AvatarURL *string   `json:"avatarURL,omitempty" validate:"omitempty"`
	Likes     int64     `json:"likes,omitempty" validate:"omitempty"`
}

// CommentList All comment response
type CommentList struct {
	TotalCount int            `json:"totalCount"`
	TotalPages int            `json:"totalPages"`
	Page       int            `json:"page"`
	Size       int            `json:"size"`
	HasMore    bool           `json:"hasMore"`
	Comments   []*CommentBase `json:"comments"`
}
