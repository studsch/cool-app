package like

import "github.com/gofiber/fiber/v2"

type Handlers interface {
	LikePost() fiber.Handler
	UnlikePost() fiber.Handler
	GetPostLikeCount() fiber.Handler
	LikeComment() fiber.Handler
	UnlikeComment() fiber.Handler
}
