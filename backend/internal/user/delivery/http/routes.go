package http

import (
	"github.com/gofiber/fiber/v2"

	"github.com/studsch/cool-app/backend/internal/middleware"
	"github.com/studsch/cool-app/backend/internal/user"
)

func MapUserRoutes(
	userGroup fiber.Router, h user.Handlers, mw *middleware.MiddlewareManager,
) {
	userGroup.Post("/follow", mw.AuthJWTMiddleware(), h.Follow())
	userGroup.Delete("/follow/:id", mw.AuthJWTMiddleware(), h.Unfollow())
	userGroup.Put("/follow/:id", mw.AuthJWTMiddleware(), h.UpdateNotification())
	userGroup.Get("/subscriptions/:userID", h.GetSubscriptions())
	userGroup.Get("/subscriptions/count/:userID", h.GetSubscriptionsCount())
	userGroup.Get("/subscribers/count/:userID", h.GetSubscribersCount())
	userGroup.Get("/search/user", mw.AuthJWTMiddleware(), h.Search())
	userGroup.Get(
		"/recommend/user", mw.AuthJWTMiddleware(),
		h.GetRecommendedUsers(),
	)
	userGroup.Get("/friends", mw.AuthJWTMiddleware(), h.GetFriends())
	userGroup.Get("/phone/:phone", h.CheckUserWithPhoneExists())
	userGroup.Get("/login/:login", h.CheckUserWithLoginExists())
	userGroup.Get("", h.GetUserByLogin())
	userGroup.Get(
		"/subscribed", mw.AuthJWTMiddleware(), h.CheckSubscribeExists(),
	)
	userGroup.Get("/:userID", h.GetMiniUserByID())
}
