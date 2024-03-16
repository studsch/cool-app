package post

import "github.com/gofiber/fiber/v2"

// Handlers Post HTTP handlers interface
type Handlers interface {
	Create() fiber.Handler
	Update() fiber.Handler
	Archive() fiber.Handler
	Delete() fiber.Handler
	GetPosts() fiber.Handler
	GetByID() fiber.Handler
	GetByUserID() fiber.Handler
	UploadImages() fiber.Handler
	GetImageURL() fiber.Handler
	Search() fiber.Handler
}
