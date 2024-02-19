package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
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
		})
	}
}
