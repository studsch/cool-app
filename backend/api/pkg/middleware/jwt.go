package middleware

import (
	jwtMiddleware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"

	"github.com/studsch/cool-app/backend/pkg/configs"
)

func JWTProtected() func(ctx *fiber.Ctx) error {
	config := jwtMiddleware.Config{
		SigningKey: jwtMiddleware.SigningKey{
			Key: []byte(configs.Config("JWT_SECRET_KEY")),
		},
		ContextKey:   "jwt",
		ErrorHandler: jwtError,
	}

	return jwtMiddleware.New(config)
}

func jwtError(c *fiber.Ctx, err error) error {
	if err.Error() == "Missing or malformed JWT" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": true,
		"msg":   err.Error(),
	})
}
