package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/app/controllers"
)

func Public(a *fiber.App) {
	v1 := a.Group("/api/v1")

	v1.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})
	v1.Get("/version", func(c *fiber.Ctx) error {
		return c.SendString("1")
	})

	v1.Post("/user/sign/up", controllers.UserSignUp)
}
