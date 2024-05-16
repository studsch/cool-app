package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/rec"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type recHandlers struct {
	recUC rec.UseCase
	log   logger.Logger
}

func NewRecHandlers(
	recUC rec.UseCase, log logger.Logger,
) rec.Handlers {
	return &recHandlers{
		recUC: recUC,
		log:   log,
	}
}

func (h *recHandlers) GetRecPosts() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if err := h.recUC.PredictPostsByUserID(c.UserContext()); err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON("")
	}
}
