package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/msg"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type msgHandlers struct {
	cfg   *config.Config
	log   logger.Logger
	msgUC msg.UseCase
}

func NewMsgHandlers(
	cfg *config.Config, log logger.Logger, msgUC msg.UseCase,
) *msgHandlers {
	return &msgHandlers{
		cfg:   cfg,
		log:   log,
		msgUC: msgUC,
	}
}

func (h *msgHandlers) CreateChat() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user2ID, err := uuid.Parse(c.Params("user2Id"))
		if err != nil {
			// TODO: change later
			return c.SendStatus(fiber.StatusBadRequest)
		}

		user, err := utils.GetUserFromCtx(c.UserContext())
		if err != nil {
			// TODO: change later
			return c.SendStatus(fiber.StatusBadRequest)
		}

		newChat, err := h.msgUC.CreateChat(c.Context(), user.ID, user2ID)
		if err != nil {
			// TODO: change later
			return c.SendStatus(fiber.StatusBadRequest)
		}

		return c.Status(fiber.StatusCreated).JSON(newChat)
	}
}
