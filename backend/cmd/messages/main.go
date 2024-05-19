package main

import (
	"fmt"
	"log"
	"log/slog"
	"os"
	"sync"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	msgWebSocket "github.com/studsch/cool-app/backend/internal/msg/delivery/socket"
	msgRepository "github.com/studsch/cool-app/backend/internal/msg/repository"
	msgUseCase "github.com/studsch/cool-app/backend/internal/msg/usecase"
	userRepository "github.com/studsch/cool-app/backend/internal/user/repository"
	"github.com/studsch/cool-app/backend/pkg/db/postgres"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

var (
	clients   = make(map[uuid.UUID]map[*websocket.Conn]uuid.UUID)
	broadcast = make(chan models.Message)
	mutex     = &sync.Mutex{}
)

func main() {
	configPath := utils.GetConfigPath(os.Getenv("config"))

	cfgFile, err := config.LoadConfig(configPath)
	if err != nil {
		log.Fatalf("LoadConfig: %v", err)
	}

	cfg, err := config.ParseConfig(cfgFile)
	if err != nil {
		log.Fatalf("ParseConfig: %v", err)
	}

	psqlDB, err := postgres.NewPsqlDB(cfg)
	if err != nil {
		log.Fatalf("Postgresql init: %s", err)
	} else {
		slog.Info("Postgres connected", "status", psqlDB.Stat())
	}
	defer psqlDB.Close()

	userRepo := userRepository.NewUserRepository(psqlDB)
	msgRepo := msgRepository.NewPsqlRepo(psqlDB)
	msgUC := msgUseCase.NewChatUC(msgRepo, userRepo)
	msgHanlders := msgWebSocket.NewMsgHandlers(msgUC, broadcast, clients, mutex)

	app := fiber.New()

	app.Use("/chat", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			token, err := utils.ExtractTokenMetadata(c, cfg)
			if err != nil {
				return fiber.ErrForbidden
			}

			userID, err := uuid.Parse(token.ID)
			if err != nil {
				slog.Error("can't parse user id from token")
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "can't parse user id from token",
				})

			}
			c.Locals("userID", userID)

			now := time.Now().Unix()
			if now >= token.ExpiresAt {
				slog.Error("given access token is expired")

				return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
					"error": "access token is expired",
				})
			}

			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/chat/:chatID", websocket.New(msgHanlders.Chat))
	go msgHanlders.WriteMessages()

	log.Fatal(app.Listen(fmt.Sprintf(":%s", cfg.MsgServerConfig.Port)))
}
