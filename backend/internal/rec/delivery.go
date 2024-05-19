package rec

import "github.com/gofiber/fiber/v2"

type Handlers interface {
	GetRecPosts() fiber.Handler
}
