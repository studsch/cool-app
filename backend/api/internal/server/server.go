package server

import (
	"context"
	"fmt"
	"log"
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
	fiber *fiber.App
	cfg   *config.Config
}

func NewServer(cfg *config.Config) *Server {
	return &Server{
		cfg: cfg,
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

	if err := s.fiber.Listen(url); err != nil {
		log.Fatalf("Server is not running. Reason: %v", err)
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	<-quit

	ctx, shutdown := context.WithTimeout(context.Background(), ctxTimeout*time.Second)
	defer shutdown()

	return s.fiber.Server().ShutdownWithContext(ctx)
}
