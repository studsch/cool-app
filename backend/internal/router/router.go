package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/studsch/cool-app/backend/internal/handler"
	"github.com/studsch/cool-app/backend/internal/middleware"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api", logger.New())
	api.Get("/", handler.Ping)

	// Auth
	// auth := api.Group("/auth")
	// auth.Post("/login", handler.Login)

	// User
	user := api.Group("/user")
	user.Patch("/:id", middleware.Protected(), handler.Ping)
}
