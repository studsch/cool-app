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
}
