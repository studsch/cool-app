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
	postGroup.Get("/liked", mw.AuthJWTMiddleware(), h.GetLikedPostsByUserID())
	postGroup.Put("/:id", mw.AuthJWTMiddleware(), h.Update())
	postGroup.Patch("/:id", mw.AuthJWTMiddleware(), h.Archive())
	postGroup.Delete("/:id", mw.AuthJWTMiddleware(), h.Delete())
	postGroup.Get("/", mw.AuthJWTMiddleware(), h.GetPosts())
	postGroup.Get("/:id", mw.AuthJWTMiddleware(), h.GetByID())
	postGroup.Get("/user/:id", mw.AuthJWTMiddleware(), h.GetByUserID())
	postGroup.Post("/:id", mw.AuthJWTMiddleware(), h.UploadImages())
	postGroup.Get("/image/:bucket/:key", h.GetImageURL())
	postGroup.Get("/search/post", mw.AuthJWTMiddleware(), h.Search())
	postGroup.Get("/popular/post", mw.AuthJWTMiddleware(), h.GetPopularPosts())
	// postGroup.Get("/tags/:title", h.AddTagsByTitles())
}
