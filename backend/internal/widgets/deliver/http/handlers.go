package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/widgets"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type widgetsHandlers struct {
	widgetsUC widgets.UseCase
	log       logger.Logger
}

func NewWidgetsHandlers(
	widgetsUC widgets.UseCase, log logger.Logger,
) widgets.Handlers {
	return &widgetsHandlers{
		widgetsUC: widgetsUC,
		log:       log,
	}
}

func (h *widgetsHandlers) GetWidgets() fiber.Handler {
	return func(c *fiber.Ctx) error {
		allWidgets, err := h.widgetsUC.GetWidgets(c.UserContext())
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(allWidgets)
	}
}
