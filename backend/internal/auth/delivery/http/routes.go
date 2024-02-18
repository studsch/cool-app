package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/auth"
)

// MapAuthRoutes Map auth routes
func MapAuthRoutes(authGroup fiber.Router, h auth.Handlers, mw string) {
	authGroup.Post("/register", h.Register())
}
