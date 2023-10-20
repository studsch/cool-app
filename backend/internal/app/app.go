package app

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/internal/router"
)

func Main() {
	app := fiber.New()

	router.SetupRoutes(app)
	log.Fatal(app.Listen(":3000"))
}
