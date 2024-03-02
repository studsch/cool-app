package server

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/studsch/cool-app/backend/pkg/logger"

	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/config"
)

const (
	ctxTimeout = 5
)

// Server struct
type Server struct {
	fiber  *fiber.App
	cfg    *config.Config
	db     *pgxpool.Pool
	logger logger.Logger
}

// NewServer New server constructor
func NewServer(cfg *config.Config, db *pgxpool.Pool, logger logger.Logger) *Server {
	return &Server{
		cfg:    cfg,
		db:     db,
		logger: logger,
	}
}

// Run Start server
func (s *Server) Run() error {
	s.fiber = fiber.New(fiber.Config{
		ReadTimeout: time.Second * s.cfg.Server.ReadTimeout,
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
