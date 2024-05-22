package http

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/msg"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
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
		user2ID, err := uuid.Parse(c.Params("user2ID"))
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		newChat, err := h.msgUC.CreateChat(c.UserContext(), user2ID)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusCreated).JSON(newChat)
	}
}

func (h *msgHandlers) GetChats() fiber.Handler {
	return func(c *fiber.Ctx) error {
		chatsList, err := h.msgUC.GetChatsByUserID(c.UserContext())
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(chatsList)
	}
}

func (h *msgHandlers) GetChatByID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		chatID, err := uuid.Parse(c.Params("chatID"))
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		chatByID, err := h.msgUC.GetChatByID(c.UserContext(), chatID)
		if err != nil {
			status, msg := httpErrors.ErrorResponse(err)
			utils.LogResponseError(c, h.log, err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(chatByID)
	}
}

func (h *msgHandlers) GetMessages() fiber.Handler {
	return func(c *fiber.Ctx) error {
		chatID, err := uuid.Parse(c.Query("chatId"))
		if err != nil {
			status, msg := httpErrors.ErrorResponse(err)
			utils.LogResponseError(c, h.log, err)
			return c.Status(status).JSON(msg)
		}

		lastMsgTime, err := time.Parse("2006-01-02T15:04:05", c.Query("lastMsgTime"))
		if err != nil {
			status, msg := httpErrors.ErrorResponse(err)
			utils.LogResponseError(c, h.log, err)
			return c.Status(status).JSON(msg)
		}

		msgList, err := h.msgUC.GetMessages(c.UserContext(), chatID, lastMsgTime)
		if err != nil {
			status, msg := httpErrors.ErrorResponse(err)
			utils.LogResponseError(c, h.log, err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(msgList)
	}
}
