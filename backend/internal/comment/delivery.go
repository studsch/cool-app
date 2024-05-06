package comment

import (
	"github.com/gofiber/fiber/v2"
)

// Handlers Post HTTP handlers interface
type Handlers interface {
	Create() fiber.Handler
	Delete() fiber.Handler
	GetByID() fiber.Handler
	GetAllByPostID() fiber.Handler
	GetReplyByCommentID() fiber.Handler
	GetCommentCountByPostID() fiber.Handler
	GetReplyCountByCommentID() fiber.Handler
}
