package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/middleware"
	"github.com/studsch/cool-app/backend/internal/post"
)

// MapPostRoutes Map post routes
func MapPostRoutes(
	postGroup fiber.Router, h post.Handlers, mw *middleware.MiddlewareManager,
) {
	postGroup.Post("/", mw.AuthJWTMiddleware(), h.Create())
	postGroup.Put("/:id", mw.AuthJWTMiddleware(), h.Update())
	postGroup.Patch("/:id", mw.AuthJWTMiddleware(), h.Archive())
	postGroup.Delete("/:id", mw.AuthJWTMiddleware(), h.Delete())
	postGroup.Get("/", h.GetPosts())
	postGroup.Get("/:id", h.GetByID())
	postGroup.Get("/user/:id", h.GetByUserID())
	postGroup.Post("/:id", mw.AuthJWTMiddleware(), h.UploadImages())
	postGroup.Get("/image/:bucket/:key", h.GetImageURL())
	postGroup.Get("/search/post", h.Search())
}
