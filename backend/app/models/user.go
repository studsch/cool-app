package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID `validate:"required,uuid"`
	Phone        string    `validate:"e164"`
	PasswordHash string    `validate:"required,lte=255"`
	Name         string    `validate:"required,lte=80"`
	Surname      string    `validate:"required,lte=80"`
	DateOfBirth  time.Time
	Gender       string `validate:"required,lte=10,oneof=Male Female"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	UserRole     string `validate:"required,lte=10"`
	Deleted      bool
}
