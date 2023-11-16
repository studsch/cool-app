package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/studsch/cool-app/backend/app/controllers"
	"github.com/studsch/cool-app/backend/pkg/middleware"
)

func Private(a *fiber.App) {
	route := a.Group("/api/v1")

	// TODO: RENEW TOKENS

	route.Post("/user/sign/out", middleware.JWTProtected(), controllers.UserSignOut)
}
