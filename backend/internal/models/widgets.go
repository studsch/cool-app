package models

type AllWidgets struct {
	MostLikedUserInfo  *MiniUser `json:"mostLikedUserInfo" validate:"omitempty"`
	MostViewedUserInfo *MiniUser `json:"mostViewedUserInfo" validate:"omitempty"`
	MostLikedTag       *Tag      `json:"mostLikedTag" validate:"omitempty"`
}
