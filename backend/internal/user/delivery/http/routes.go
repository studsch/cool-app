package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/middleware"
	"github.com/studsch/cool-app/backend/internal/user"
)

func MapUserRoutes(
	userGroup fiber.Router, h user.Handlers, mw *middleware.MiddlewareManager,
) {
	userGroup.Post("/follow", mw.AuthJWTMiddleware(), h.Follow())
	userGroup.Delete("/follow/:id", mw.AuthJWTMiddleware(), h.Unfollow())
	userGroup.Put("follow/:id", mw.AuthJWTMiddleware(), h.UpdateNotification())
}
