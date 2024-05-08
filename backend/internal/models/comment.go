package models

import (
	"time"

	"github.com/google/uuid"
)

// Comment Comment base model
type Comment struct {
	CreatedAt     time.Time `json:"createdAt,omitempty" validate:"omitempty"`
	Content       string    `json:"content,omitempty" validate:"required,gte=1,lte=255"`
	ID            uuid.UUID `json:"id,omitempty" validate:"omitempty"`
	UserID        uuid.UUID `json:"userId,omitempty" validate:"required"`
	PostID        uuid.UUID `json:"postId,omitempty" validate:"required"`
	ReplyTo       uuid.UUID `json:"replyTo,omitempty"`
	MainCommentID uuid.UUID `json:"mainCommentId" validate:"omitempty"`
	Deleted       bool      `json:"deleted,omitempty" validate:"omitempty"`
}

// CommentBase Base comment response
type CommentBase struct {
	CreatedAt     time.Time `json:"createdAt,omitempty" validate:"omitempty"`
	AvatarURL     *string   `json:"avatarURL,omitempty" validate:"omitempty"`
	Content       string    `json:"content,omitempty" validate:"required,gte=1,lte=255"`
	Author        string    `json:"author,omitempty" validate:"omitempty"`
	Likes         int64     `json:"likes,omitempty" validate:"omitempty"`
	MainCommentID uuid.UUID `json:"mainCommentId" validate:"omitempty"`
	ID            uuid.UUID `json:"id,omitempty" validate:"omitempty"`
	UserID        uuid.UUID `json:"userId,omitempty" validate:"required"`
	PostID        uuid.UUID `json:"postId,omitempty" validate:"required"`
	ReplyTo       uuid.UUID `json:"replyTo,omitempty" validate:"omitempty"`
}

// CommentList All comment response
type CommentList struct {
	Comments   []*CommentBase `json:"comments"`
	TotalCount int            `json:"totalCount"`
	TotalPages int            `json:"totalPages"`
	Page       int            `json:"page"`
	Size       int            `json:"size"`
	HasMore    bool           `json:"hasMore"`
}
