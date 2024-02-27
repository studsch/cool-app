package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/middleware"
	"github.com/studsch/cool-app/backend/internal/post"
)

// MapPostRoutes Map post routes
func MapPostRoutes(
	postGroup fiber.Router, h post.Handlers, mw *middleware.MiddlewareManager,
) {
	postGroup.Post("/", mw.AuthJWTMiddleware(), h.Create())
}
