package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/post"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// postHandlers Post handlers
type postHandlers struct {
	cfg    *config.Config
	postUC post.UseCase
	logger logger.Logger
}

// NewPostHandlers Post handlers constructor
func NewPostHandlers(cfg *config.Config, postUC post.UseCase, logger logger.Logger) post.Handlers {
	return &postHandlers{
		cfg:    cfg,
		postUC: postUC,
		logger: logger,
	}
}

// Create Creates new post
func (h *postHandlers) Create() fiber.Handler {
	return func(c *fiber.Ctx) error {
		p := &models.Post{}
		if err := c.BodyParser(p); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		createdPost, err := h.postUC.Create(c.UserContext(), p)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusCreated).JSON(createdPost)
	}
}

// Update Updates post
func (h *postHandlers) Update() fiber.Handler {
	return func(c *fiber.Ctx) error {
		postID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		p := &models.Post{}
		if err := c.BodyParser(p); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}
		p.ID = postID

		updatedPost, err := h.postUC.Update(c.UserContext(), p)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(updatedPost)
	}
}

// Archive Archives post
func (h *postHandlers) Archive() fiber.Handler {
	return func(c *fiber.Ctx) error {
		postID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		if err := h.postUC.Archive(c.UserContext(), postID); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.SendStatus(fiber.StatusOK)
	}
}

// Delete Deletes post
func (h *postHandlers) Delete() fiber.Handler {
	return func(c *fiber.Ctx) error {
		postID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		if err := h.postUC.Delete(c.UserContext(), postID); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.SendStatus(fiber.StatusOK)
	}
}
