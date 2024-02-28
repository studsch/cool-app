package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/comment"
	"github.com/studsch/cool-app/backend/internal/middleware"
)

// MapCommentRoutes Map comment routes
func MapCommentRoutes(
	commGroup fiber.Router, h comment.Handlers, mw *middleware.MiddlewareManager,
) {
	commGroup.Post("/", mw.AuthJWTMiddleware(), h.Create())
	commGroup.Delete("/:id", mw.AuthJWTMiddleware(), h.Delete())
	commGroup.Get("/:id", h.GetByID())
	commGroup.Get("/post/:id", h.GetAllByPostID())
	commGroup.Get("/:id/reply", h.GetReplyByCommentID())
}
