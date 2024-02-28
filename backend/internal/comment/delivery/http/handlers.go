package http

import (
	"github.com/gofiber/fiber/v2"
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

		comment := &models.Comment{}
		comment.UserID = user.ID

		if err := c.BodyParser(comment); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		createdComment, err := h.commentUC.Create(c.UserContext(), comment)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusCreated).JSON(createdComment)
	}
}

func (h *commentHandlers) Delete() fiber.Handler {
	//TODO implement me
	panic("implement me")
}

func (h *commentHandlers) GetByID() fiber.Handler {
	//TODO implement me
	panic("implement me")
}

func (h *commentHandlers) GetAllByPostID() fiber.Handler {
	//TODO implement me
	panic("implement me")
}

func (h *commentHandlers) GetReplyByCommentID() fiber.Handler {
	//TODO implement me
	panic("implement me")
}
