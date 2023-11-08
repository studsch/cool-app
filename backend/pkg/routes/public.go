package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/studsch/cool-app/backend/app/controllers"
)

func Public(a *fiber.App) {
	router := a.Group("/api/v1")

	router.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})
	router.Get("/version", func(c *fiber.Ctx) error {
		return c.SendString("1")
	})

	router.Post("/user/sign/up", controllers.UserSignUp)
	router.Post("/user/sign/in/phone", controllers.UserSignInPhone)
	router.Post("/user/sign/in/login", controllers.UserSignInLogin)
}
