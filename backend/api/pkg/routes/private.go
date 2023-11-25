package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/studsch/cool-app/backend/app/controllers"
	"github.com/studsch/cool-app/backend/pkg/middleware"
)

func Private(a *fiber.App) {
	router := a.Group("/api/v1")

	// TODO: RENEW TOKENS

	router.Post("/user/sign/out", middleware.JWTProtected(), controllers.UserSignOut)

	// Posts
	router.Post("/post", middleware.JWTProtected(), controllers.CreatePost)
	router.Put("/post/:id", middleware.JWTProtected(), controllers.UpdatePost)
	router.Delete("/post/:id", middleware.JWTProtected(), controllers.DeletePost)
	router.Patch("/post/:id", middleware.JWTProtected(), controllers.ArchivePost)

	// User
	router.Post("/user/follow/:id", middleware.JWTProtected(), controllers.UserFollow)
}
