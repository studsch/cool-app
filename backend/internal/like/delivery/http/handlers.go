package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/like"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type likeHandlers struct {
	cfg    *config.Config
	likeUC like.UseCase
	log    logger.Logger
}

// GetPostLikeCount implements like.Handlers.
func (h *likeHandlers) GetPostLikeCount() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		postID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		count, err := h.likeUC.GetPostLikeCount(c.UserContext(), postID)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"likeCount": count,
		})
	}
}

// LikeComment implements like.Handlers.
func (h *likeHandlers) LikeComment() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		l := &models.LikeComment{}
		if err := c.BodyParser(l); err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		likedComment, err := h.likeUC.LikeComment(c.UserContext(), l)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusCreated).JSON(likedComment)
	}
}

// LikePost implements like.Handlers.
func (h *likeHandlers) LikePost() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		l := &models.LikePost{}
		if err := c.BodyParser(l); err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		likedPost, err := h.likeUC.LikePost(c.UserContext(), l)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusCreated).JSON(likedPost)
	}
}

// UnlikeComment implements like.Handlers.
func (h *likeHandlers) UnlikeComment() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		l := &models.LikeComment{}
		if err := c.BodyParser(l); err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		err := h.likeUC.UnlikeComment(c.UserContext(), l)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.SendStatus(fiber.StatusOK)
	}
}

// UnlikePost implements like.Handlers.
func (h *likeHandlers) UnlikePost() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		l := &models.LikePost{}
		if err := c.BodyParser(l); err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		err := h.likeUC.UnlikePost(c.UserContext(), l)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.SendStatus(fiber.StatusOK)
	}
}

func NewLikeHandlers(cfg *config.Config, likeUC like.UseCase, log logger.Logger) like.Handlers {
	return &likeHandlers{
		cfg:    cfg,
		likeUC: likeUC,
		log:    log,
	}
}
