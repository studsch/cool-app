package http

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
	"net/http"
)

// authHandlers Auth handlers
type authHandlers struct {
	cfg    *config.Config
	authUC auth.UseCase
	logger logger.Logger
}

// NewAuthHandlers Auth handlers constructor
func NewAuthHandlers(cfg *config.Config, authUC auth.UseCase, logger logger.Logger) auth.Handlers {
	return &authHandlers{
		cfg:    cfg,
		authUC: authUC,
		logger: logger,
	}
}

// Register Register new user
func (h *authHandlers) Register() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := &models.User{}
		if err := utils.ReadRequest(c, user); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		createdUser, err := h.authUC.Register(c.Context(), user)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		// TODO: session

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"error": false,
			"user":  createdUser.User,
			"tokens": fiber.Map{
				"access":  createdUser.AccessToken,
				"refresh": createdUser.RefreshToken,
			},
		})
	}
}

func (h *authHandlers) Login() fiber.Handler {
	// TODO: excluded_with - bug
	// required_without=PhoneNumber,excluded_with=PhoneNumber,
	// required_without=Login,excluded_with=Login,
	type Login struct {
		Login       string  `json:"login,omitempty" validate:"omitempty,gte=8,lte=30"`
		PhoneNumber *string `json:"phoneNumber,omitempty" validate:"omitempty,e164"`
		Password    string  `json:"password,omitempty" validate:"required,gte=8"`
	}
	return func(c *fiber.Ctx) error {
		login := &Login{}
		if err := utils.ReadRequest(c, login); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		userWithTokens, err := h.authUC.Login(c.Context(), &models.User{
			Login:       login.Login,
			PhoneNumber: login.PhoneNumber,
			Password:    login.Password,
		})
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"error": false,
			"user":  userWithTokens.User,
			"tokens": fiber.Map{
				"access":  userWithTokens.AccessToken,
				"refresh": userWithTokens.RefreshToken,
			},
		})
	}
}

func (h *authHandlers) Logout() fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := utils.ExtractTokenMetadata(c, h.cfg)
		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		}

		userID := claims.ID
		fmt.Println(userID)

		// TODO: connect to redis
		// TODO: delete refresh token in redis

		return c.SendStatus(fiber.StatusNoContent)
	}
}
