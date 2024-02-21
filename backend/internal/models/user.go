package models

import (
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type User struct {
	ID          uuid.UUID  `json:"id,omitempty" validate:"omitempty"`
	FirstName   string     `json:"firstName,omitempty" validate:"required,lte=30"`
	LastName    string     `json:"lastName,omitempty" validate:"required,lte=30"`
	Login       string     `json:"login,omitempty" validate:"required,gte=8,lte=30"`
	Password    string     `json:"password,omitempty" validate:"required,gte=8"`
	PhoneNumber *string    `json:"phoneNumber,omitempty" validate:"required,e164"`
	Role        *string    `json:"role,omitempty" validate:"omitempty,lte=10"`
	Avatar      *string    `json:"avatar,omitempty" validate:"omitempty"`
	Gender      *string    `json:"gender,omitempty" validate:"required,oneof=male female"`
	About       *string    `json:"about,omitempty" validate:"omitempty,lte=1024"`
	City        *string    `json:"city,omitempty" validate:"omitempty,lte=24"`
	Country     *string    `json:"country,omitempty" validate:"omitempty,lte=24"`
	Birthday    *time.Time `json:"birthday,omitempty" validate:"omitempty"`
	CreatedAt   time.Time  `json:"createdAt,omitempty" validate:"omitempty"`
	UpdatedAt   time.Time  `json:"updatedAt,omitempty" validate:"omitempty"`
}

type UserWithTokens struct {
	User         *User  `json:"user"`
	AccessToken  string `json:"access"`
	RefreshToken string `json:"refresh"`
}

// HashPassword Hash user password with bcrypt
func (u *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// ComparePasswords Compare user password and payload
func (u *User) ComparePasswords(password string) error {
	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password)); err != nil {
		return err
	}
	return nil
}

// SanitizePassword Sanitize user password
func (u *User) SanitizePassword() {
	u.Password = ""
}

// PrepareCreate prepare user for register
func (u *User) PrepareCreate() error {
	if err := u.HashPassword(); err != nil {
		return err
	}
	return nil
}
