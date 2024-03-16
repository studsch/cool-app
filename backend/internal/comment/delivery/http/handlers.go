package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/comment"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// commentHandlers Comment handlers
type commentHandlers struct {
	cfg       *config.Config
	commentUC comment.UseCase
	logger    logger.Logger
}

// NewCommentHandlers Comment handlers constructor
func NewCommentHandlers(cfg *config.Config, commentUC comment.UseCase, logger logger.Logger) comment.Handlers {
	return &commentHandlers{
		cfg:       cfg,
		commentUC: commentUC,
		logger:    logger,
	}
}

// Create Creates new comment
func (h *commentHandlers) Create() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, err := utils.GetUserFromCtx(c.UserContext())
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		comm := &models.Comment{}
		comm.UserID = user.ID

		if err := c.BodyParser(comm); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		createdComment, err := h.commentUC.Create(c.UserContext(), comm)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusCreated).JSON(createdComment)
	}
}

func (h *commentHandlers) Delete() fiber.Handler {
	return func(c *fiber.Ctx) error {
		commID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		if err := h.commentUC.Delete(c.UserContext(), commID); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.SendStatus(fiber.StatusOK)
	}
}

func (h *commentHandlers) GetByID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		commID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		commByID, err := h.commentUC.GetByID(c.UserContext(), commID)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(commByID)
	}
}

func (h *commentHandlers) GetAllByPostID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		postID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		pq, err := utils.GetPaginationFromCtx(c)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		commByPostID, err := h.commentUC.GetAllByPostID(c.UserContext(), postID, pq)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(commByPostID)
	}
}

func (h *commentHandlers) GetReplyByCommentID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		commID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		pq, err := utils.GetPaginationFromCtx(c)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		commByPostID, err := h.commentUC.GetReplyByCommentID(c.UserContext(), commID, pq)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(commByPostID)
	}
}
