package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/middleware"
	"github.com/studsch/cool-app/backend/internal/rec"
)

func MapRecRoutes(
	recGroup fiber.Router, h rec.Handlers, mw *middleware.MiddlewareManager,
) {
	recGroup.Get("/posts", mw.AuthJWTMiddleware(), h.GetRecPosts())
}
