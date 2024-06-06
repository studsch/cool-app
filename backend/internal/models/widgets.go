package models

type AllWidgets struct {
	MostLikedUserInfo  *MiniUser        `json:"mostLikedUserInfo" validate:"omitempty"`
	MostViewedUserInfo *MiniUser        `json:"mostViewedUserInfo" validate:"omitempty"`
	MostLikedTag       *Tag             `json:"mostLikedTag" validate:"omitempty"`
	Weather            *WeatherResponse `json:"weather"`
}

type NominatimResponse struct {
	Lat         string `json:"lat"`
	Lon         string `json:"lon"`
	DisplayName string `json:"display_name"`
}

type WeatherResponse struct {
	DisplayName string `json:"display_name"`
	Timezone    string `json:"timezone"`
	Current     struct {
		Temperature float64 `json:"temperature"`
		WindSpeed   float64 `json:"windspeed"`
	} `json:"current_weather"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}
