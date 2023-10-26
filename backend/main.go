package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/pkg/configs"
	"github.com/studsch/cool-app/backend/pkg/middleware"
	"github.com/studsch/cool-app/backend/pkg/routes"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

func main() {
	config := configs.Fiber()

	app := fiber.New(config)

	middleware.Fiber(app)

	routes.Public(app)
	routes.NotFound(app)

	switch configs.Config("STAGE_STATUS") {
	case "dev":
		utils.StartServer(app)
	case "prod":
		panic("Not implemented")
	}
}
