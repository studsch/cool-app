package http

import (
	"fmt"

	"github.com/studsch/cool-app/backend/pkg/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/internal/middleware"
)

// MapAuthRoutes Map auth routes
func MapAuthRoutes(
	authGroup fiber.Router, h auth.Handlers, mw *middleware.MiddlewareManager,
) {
	authGroup.Post("/register", h.Register())
	authGroup.Post("/login", h.Login())
	authGroup.Get("/search/user", h.Search())
	authGroup.Use(mw.AuthJWTMiddleware())
	authGroup.Post("/logout", h.Logout())
	authGroup.Post("/avatar", h.UploadAvatar())
	authGroup.Get("/health", func(c *fiber.Ctx) error {
		q := c.Locals("user")
		u, e := utils.GetUserFromCtx(c.UserContext())
		if e != nil {
			fmt.Println("qweqwe")
		}
		fmt.Println(u)
		fmt.Println(q)
		return c.SendStatus(fiber.StatusOK)
	})
}
