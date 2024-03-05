package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/like"
	"github.com/studsch/cool-app/backend/internal/middleware"
)

func MapLikeRoutes(
	likeGroup fiber.Router, h like.Handlers, mw *middleware.MiddlewareManager,
) {
	likeGroup.Post("/post", mw.AuthJWTMiddleware(), h.LikePost())
	likeGroup.Delete("/post", mw.AuthJWTMiddleware(), h.UnlikePost())
	likeGroup.Get("/post/:id", h.GetPostLikeCount())
	likeGroup.Post("/comment", mw.AuthJWTMiddleware(), h.LikeComment())
	likeGroup.Delete("/comment", mw.AuthJWTMiddleware(), h.UnlikeComment())
}
