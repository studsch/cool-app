package routes

import "github.com/gofiber/fiber/v2"

func NotFound(a *fiber.App) {
	a.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).SendString("Endpoint is not found")
	})
}
