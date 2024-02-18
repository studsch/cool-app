package server

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	authHttp "github.com/studsch/cool-app/backend/internal/auth/delivery/http"
	authRepository "github.com/studsch/cool-app/backend/internal/auth/repository"
	authUseCase "github.com/studsch/cool-app/backend/internal/auth/usecase"
)

// MapHandlers Map server handlers
func (s *Server) MapHandlers(a *fiber.App) error {
	// Init repositories
	authRepo := authRepository.NewAuthRepository(s.db)

	// Init useCases
	authUC := authUseCase.NewAuthUC(s.cfg, authRepo, s.logger)

	// Init handlers
	authHandlers := authHttp.NewAuthHandlers(s.cfg, authUC, s.logger)

	a.Use(requestid.New())

	v1 := a.Group("/api/v1")

	health := v1.Group("/health")
	authGroup := v1.Group("/auth")

	authHttp.MapAuthRoutes(authGroup, authHandlers, "")

	health.Get("", func(c *fiber.Ctx) error {
		s.logger.Info("Health check")
		fmt.Println(fiber.ErrBadRequest.Code)
		fmt.Println(fiber.ErrBadRequest.Message)
		fmt.Println(fiber.ErrBadRequest.Error())
		return c.SendStatus(fiber.StatusOK)
	})
	return nil
}
