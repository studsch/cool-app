package auth

import "github.com/gofiber/fiber/v2"

// Handlers Auth HTTP handlers interface
type Handlers interface {
	Register() fiber.Handler
	Login() fiber.Handler
	Logout() fiber.Handler
	UploadAvatar() fiber.Handler
	Search() fiber.Handler
}
