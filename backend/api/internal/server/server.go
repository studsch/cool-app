package server

import (
	"context"
	"fmt"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/config"
)

const (
	ctxTimeout = 5
)

type Server struct {
	fiber  *fiber.App
	cfg    *config.Config
	logger logger.Logger
}

func NewServer(cfg *config.Config, logger logger.Logger) *Server {
	return &Server{
		cfg:    cfg,
		logger: logger,
	}
}

func (s *Server) Run() error {
	readTimeout, _ := strconv.Atoi(s.cfg.Server.ReadTimeout)
	s.fiber = fiber.New(fiber.Config{
		ReadTimeout: time.Second * time.Duration(readTimeout),
	})

	if err := s.MapHandlers(s.fiber); err != nil {
		return err
	}

	url := fmt.Sprintf(
		"%s:%s",
		s.cfg.Server.Host,
		s.cfg.Server.Port,
	)

	go func() {
		s.logger.Infof("Server is listening on PORT: %s", s.cfg.Server.Port)
		if err := s.fiber.Listen(url); err != nil {
			s.logger.Fatalf("Error starting Server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	<-quit

	ctx, shutdown := context.WithTimeout(context.Background(), ctxTimeout*time.Second)
	defer shutdown()

	s.logger.Info("server Exited Properly")
	return s.fiber.Server().ShutdownWithContext(ctx)
}
