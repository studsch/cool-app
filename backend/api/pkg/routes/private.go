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
	router.Post("/post/:postID/like", middleware.JWTProtected(), controllers.LikePost)
	router.Post("/post/:postID/unlike", middleware.JWTProtected(), controllers.UnlikePost)

	// User
	router.Post("/user/follow/:id", middleware.JWTProtected(), controllers.UserFollow)
	router.Post("/user/unfollow/:id", middleware.JWTProtected(), controllers.UserUnfollow)

	// Comments
	router.Post("/comment", middleware.JWTProtected(), controllers.CreateComment)
	router.Post("/reply", middleware.JWTProtected(), controllers.CreateReply)
	router.Post("/comment/:commentID/like", middleware.JWTProtected(), controllers.LikeComment)
	router.Post("/comment/:commentID/unlike", middleware.JWTProtected(), controllers.UnlikeComment)
}
