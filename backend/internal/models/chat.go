package models

import (
	"time"

	"github.com/google/uuid"
)

type Chat struct {
	CreatedAt time.Time `json:"createdAt"`
	User2     struct {
		Login     string    `json:"login"`
		FirstName string    `json:"firstName"`
		LastName  string    `json:"lastName"`
		Avatar    string    `json:"avatar"`
		ID        uuid.UUID `json:"id"`
	} `json:"user2"`
	ID      uuid.UUID `json:"id"`
	User1ID uuid.UUID `json:"user1Id"`
}

type Message struct {
	Time            time.Time
	Body            string
	ID              uuid.UUID
	SenderUserID    uuid.UUID
	RecipientUserID uuid.UUID
	ChatID          uuid.UUID
	ReadStatus      bool
}
