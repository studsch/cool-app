package widgets

import "github.com/gofiber/fiber/v2"

type Handlers interface {
	GetWidgets() fiber.Handler
}
