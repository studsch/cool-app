package models

import (
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserFilter struct {
	DateStart *time.Time `json:"DateStart"`
	DateEnd   *time.Time `json:"DateEnd"`
	Q         string     `json:"q"`
	OrderBy   string     `json:"orderBy"`
	Gender    string     `json:"gender"`
	City      string     `json:"city"`
	Country   string     `json:"country"`
	Offset    uint64     `json:"offset"`
	Limit     uint64     `json:"limit"`
}

type UserList struct {
	Users      []*User `json:"users"`
	TotalCount int     `json:"totalCount"`
	TotalPages int     `json:"totalPages"`
	Page       int     `json:"page"`
	Size       int     `json:"size"`
	HasMore    bool    `json:"hasMore"`
}

// User Users base model
type User struct {
	ID                 uuid.UUID  `json:"id,omitempty" validate:"omitempty"`
	FirstName          string     `json:"firstName,omitempty" validate:"omitempty,gte=2,lte=31"`
	LastName           string     `json:"lastName,omitempty" validate:"omitempty,gte=2,lte=31"`
	Login              string     `json:"login,omitempty" validate:"omitempty,gte=6,lte=31"`
	Password           string     `json:"password,omitempty" validate:"omitempty,gte=8,lte=250"`
	PhoneNumber        *string    `json:"phoneNumber,omitempty" validate:"omitempty,e164"`
	Role               *string    `json:"role,omitempty" validate:"omitempty,lte=10"`
	Avatar             *string    `json:"avatar,omitempty" validate:"omitempty"`
	Gender             *string    `json:"gender,omitempty" validate:"omitempty,oneof=male female"`
	About              *string    `json:"about,omitempty" validate:"omitempty,lte=1024"`
	City               *string    `json:"city,omitempty" validate:"omitempty,lte=24"`
	Country            *string    `json:"country,omitempty" validate:"omitempty,lte=24"`
	Birthday           *time.Time `json:"birthday,omitempty" validate:"omitempty"`
	CreatedAt          time.Time  `json:"createdAt,omitempty" validate:"omitempty"`
	UpdatedAt          time.Time  `json:"updatedAt,omitempty" validate:"omitempty"`
	SubscriptionsCount uint       `json:"subscriptionsCount" validate:"omitempty"`
	SubscribersCount   uint       `json:"subscribersCount" validate:"omitempty"`
	IsSubscribed       bool       `json:"isSubscribed" validate:"omitempty"`
}

type UserFollow struct {
	ID             uuid.UUID `json:"id,omitempty" validate:"omitempty"`
	UserID         uuid.UUID `json:"userId" validate:"required"`
	FollowToUserID uuid.UUID `json:"followToUserId" validate:"required"`
	NotificationOn bool      `json:"notificationOn" validate:"omitempty"`
}

type MiniUser struct {
	ID        uuid.UUID `json:"id,omitempty" validate:"omitempty"`
	FirstName string    `json:"firstName,omitempty" validate:"omitempty,gte=2,lte=31"`
	LastName  string    `json:"lastName,omitempty" validate:"omitempty,gte=2,lte=31"`
	Login     string    `json:"login,omitempty" validate:"omitempty,gte=6,lte=31"`
	Avatar    *string   `json:"avatar,omitempty" validate:"omitempty"`
}

type RecUserList struct {
	RecUser        *MiniUser   `json:"recUser,omitempty" validate:"omitempty"`
	FromUsers      []*MiniUser `json:"fromUsers,omitempty" validate:"omitempty"`
	FromUsersCount int         `json:"fromUsersCount,omitempty" validate:"omitempty"`
}

// UserWithTokens Users model with tokens
type UserWithTokens struct {
	User         *User  `json:"user"`
	AccessToken  string `json:"access"`
	RefreshToken string `json:"refresh"`
}

// HashPassword Hash user password with bcrypt
func (u *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(u.Password), bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// ComparePasswords Compare user password and payload
func (u *User) ComparePasswords(password string) error {
	if err := bcrypt.CompareHashAndPassword(
		[]byte(u.Password), []byte(password),
	); err != nil {
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

type RenewTokens struct {
	RefreshToken string `json:"refreshToken`
}
