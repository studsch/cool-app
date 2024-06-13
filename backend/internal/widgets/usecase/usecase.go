package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/widgets"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

const (
	openMeteoBaseURL = "https://api.open-meteo.com/v1/forecast"
	nominatimBaseURL = "https://nominatim.openstreetmap.org/search"
)

type widgetsUC struct {
	widgetsRepo widgets.GrpcRepository
	log         logger.Logger
}

func NewWidgetsUC(
	widgetsRepo widgets.GrpcRepository, log logger.Logger,
) widgets.UseCase {
	return &widgetsUC{
		widgetsRepo: widgetsRepo,
		log:         log,
	}
}

func (u *widgetsUC) GetWidgets(
	ctx context.Context, city, country string,
) (*models.AllWidgets, error) {
	userCtx, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	userID := userCtx.ID

	u1, err := u.widgetsRepo.GetMostLikedUserInfoByUserId(ctx, userID)
	if err != nil {
		u.log.Error(err)
	}

	u2, err := u.widgetsRepo.GetMostViewedUserInfoByUserId(ctx, userID)
	if err != nil {
		u.log.Error(err)
	}

	t, err := u.widgetsRepo.GetMostLikedTagByUserId(ctx, userID)
	if err != nil {
		u.log.Error(err)
	}

	var weather models.WeatherResponse
	if city != "" && country != "" {
		weather, err = getWeather(city, country)
		if err != nil {
			u.log.Error(err)
		}
	}

	allWidgets := &models.AllWidgets{
		MostLikedUserInfo:  u1,
		MostViewedUserInfo: u2,
		MostLikedTag:       t,
		Weather:            &weather,
	}

	return allWidgets, nil
}

func getLocationByName(city, country string) (models.NominatimResponse, error) {
	query := fmt.Sprintf("%s,%s", city, country)
	params := url.Values{}
	params.Add("q", query)
	params.Add("format", "json")
	fullURL := fmt.Sprintf("%s?%s", nominatimBaseURL, params.Encode())

	resp, err := http.Get(fullURL)
	if err != nil {
		return models.NominatimResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return models.NominatimResponse{}, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return models.NominatimResponse{}, err
	}

	var result []models.NominatimResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return models.NominatimResponse{}, err
	}

	if len(result) > 0 {
		return result[0], nil
	} else {
		return models.NominatimResponse{}, fmt.Errorf("no coordinates found")
	}
}

func getWeather(city, country string) (models.WeatherResponse, error) {
	location, err := getLocationByName(city, country)
	if err != nil {
		return models.WeatherResponse{}, err
	}

	params := url.Values{}
	params.Add("latitude", location.Lat)
	params.Add("longitude", location.Lon)
	params.Add("current_weather", "true")
	fullURL := fmt.Sprintf("%s?%s", openMeteoBaseURL, params.Encode())

	resp, err := http.Get(fullURL)
	if err != nil {
		return models.WeatherResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return models.WeatherResponse{}, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return models.WeatherResponse{}, err
	}

	var result models.WeatherResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return models.WeatherResponse{}, err
	}

	result.DisplayName = location.DisplayName

	return result, nil
}
