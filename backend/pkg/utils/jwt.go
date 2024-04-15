package utils

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
)

type Tokens struct {
	Access  string `json:"access"`
	Refresh string `json:"refresh"`
}

type TokenMetadata struct {
	ID        string `json:"id"`
	ExpiresAt int64  `json:"exp"`
}

func GenerateJWTTokens(user *models.User, cfg *config.Config) (*Tokens, error) {
	accessToken, err := generateNewAccessToken(user, cfg)
	if err != nil {
		return nil, err
	}

	refreshToken, err := generateNewRefreshToken(cfg)
	if err != nil {
		return nil, err
	}

	return &Tokens{
		Access:  accessToken,
		Refresh: refreshToken,
	}, nil
}

func generateNewAccessToken(user *models.User, cfg *config.Config) (string, error) {
	claims := jwt.MapClaims{}

	claims["id"] = user.ID.String()
	claims["exp"] = time.Now().Add(time.Minute * cfg.JWT.SecretKeyExpire).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(cfg.JWT.SecretKey))
	if err != nil {
		return "", err
	}

	return tokenString, err
}

func generateNewRefreshToken(cfg *config.Config) (string, error) {
	hash := sha256.New()
	refresh := cfg.JWT.RefreshKey + time.Now().String()

	_, err := hash.Write([]byte(refresh))
	if err != nil {
		return "", err
	}

	expTime := fmt.Sprint(time.Now().Add(time.Hour * cfg.JWT.RefreshKeyExpire).Unix())

	t := hex.EncodeToString(hash.Sum(nil)) + "." + expTime

	return t, err
}

func ExtractTokenMetadata(c *fiber.Ctx, cfg *config.Config) (*TokenMetadata, error) {
	bearerHeader := c.Get("Authorization")

	if bearerHeader == "" {
		return nil, fmt.Errorf("extract token metadata, bearerHeader: %s", bearerHeader)
	}

	headerParts := strings.Split(bearerHeader, " ")
	if len(headerParts) != 2 {
		return nil, fmt.Errorf("extract token metadata, headerParts: len(headerParts) != 2")
	}

	tokenString := headerParts[1]

	if tokenString == "" {
		return nil, httpErrors.InvalidJWTToken
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signin method %v", token.Header["alg"])
		}
		secret := []byte(cfg.JWT.SecretKey)
		return secret, nil
	})
	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, httpErrors.InvalidJWTToken
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, ok := claims["id"].(string)
		if !ok {
			return nil, httpErrors.InvalidJWTClaims
		}

		expTime := int64(claims["exp"].(float64))

		return &TokenMetadata{
			ID:        userID,
			ExpiresAt: expTime,
		}, err
	}

	return nil, err
}

func ParseRefreshToken(refreshToken string) (int64, error) {
	return strconv.ParseInt(strings.Split(refreshToken, ".")[1], 0, 64)
}
