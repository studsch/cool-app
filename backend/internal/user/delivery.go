package user

import "github.com/gofiber/fiber/v2"

type Handlers interface {
	Follow() fiber.Handler
	Unfollow() fiber.Handler
	UpdateNotification() fiber.Handler
	GetSubscriptions() fiber.Handler
	GetSubscriptionsCount() fiber.Handler
	GetSubscribersCount() fiber.Handler
	Search() fiber.Handler
}
