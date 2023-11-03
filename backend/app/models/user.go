package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID
	Phone        string
	PasswordHash string
	Name         string
	Surname      string
	DateOfBirth  time.Time
	Gender       string
	CreatedAt    time.Time
	UpdatedAt    time.Time
	UserRole     string
	Deleted      bool
}
