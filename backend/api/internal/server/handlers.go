package server

import "github.com/gofiber/fiber/v2"

func (s *Server) MapHandlers(a *fiber.App) error {
	v1 := a.Group("/api/v1")

	health := v1.Group("/health")

	health.Get("", func(c *fiber.Ctx) error { return c.SendStatus(fiber.StatusOK) })
	return nil
}
