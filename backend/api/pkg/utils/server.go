package utils

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"

	"github.com/studsch/cool-app/backend/pkg/configs"
)

func StartServer(a *fiber.App) {
	url := fmt.Sprintf(
		"%s:%s",
		configs.Config("SERVER_HOST"),
		configs.Config("SERVER_PORT"),
	)

	if err := a.Listen(url); err != nil {
		log.Fatalf("Server is not running. Reason: %v", err)
	}
}
