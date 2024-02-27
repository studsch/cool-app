package post

import "github.com/gofiber/fiber/v2"

// Handlers Post HTTP handlers interface
type Handlers interface {
	Create() fiber.Handler
}
