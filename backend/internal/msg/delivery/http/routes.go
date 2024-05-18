package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/middleware"
	"github.com/studsch/cool-app/backend/internal/msg"
)

func MapMsgRoutes(
	msgGroup fiber.Router, h msg.Handlers,
	mw *middleware.MiddlewareManager,
) {
	msgGroup.Post("/chat/:user2Id", mw.AuthJWTMiddleware(), h.CreateChat())
	msgGroup.Get("/chat", mw.AuthJWTMiddleware(), h.GetChats())
}
