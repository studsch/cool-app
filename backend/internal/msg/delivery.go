package msg

import "github.com/gofiber/fiber/v2"

type Handlers interface {
	CreateChat() fiber.Handler
}
