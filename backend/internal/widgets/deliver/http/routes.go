package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/middleware"
	"github.com/studsch/cool-app/backend/internal/widgets"
)

func MapWidgetsRoutes(
	widgetsGroup fiber.Router, h widgets.Handlers, mw *middleware.MiddlewareManager,
) {
	widgetsGroup.Get("/", mw.AuthJWTMiddleware(), h.GetWidgets())
}
