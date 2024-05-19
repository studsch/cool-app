package server

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/minio/minio-go/v7"
	"github.com/redis/go-redis/v9"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	"github.com/studsch/cool-app/backend/pkg/logger"

	"github.com/gofiber/fiber/v2"

	"github.com/studsch/cool-app/backend/config"
)

const (
	ctxTimeout = 5
)

// Server struct
type Server struct {
	fiber       *fiber.App
	cfg         *config.Config
	db          *pgxpool.Pool
	logger      logger.Logger
	awsClient   *minio.Client
	redisClient *redis.Client
	widgetsConn *grpc.ClientConn
	recConn     *grpc.ClientConn
}

// NewServer New server constructor
func NewServer(
	cfg *config.Config, db *pgxpool.Pool, logger logger.Logger,
	awsS3Client *minio.Client, redisClient *redis.Client,
) *Server {
	return &Server{
		cfg:         cfg,
		db:          db,
		logger:      logger,
		awsClient:   awsS3Client,
		redisClient: redisClient,
	}
}

// Run Start server
func (s *Server) Run() error {
	// widgets
	widgetsTarget := fmt.Sprintf(
		"%s:%s", s.cfg.GRPCServices.WidgetsHost,
		s.cfg.GRPCServices.WidgetsPort,
	)
	widgetsConn, err := grpc.Dial(
		widgetsTarget, grpc.WithTransportCredentials(
			insecure.NewCredentials(),
		),
	)
	if err != nil {
		s.logger.Errorf("widgets client error: %s", err.Error())
		os.Exit(1)
	}
	defer widgetsConn.Close()

	s.widgetsConn = widgetsConn
	s.logger.Infof(
		"Widgets client is connected to PORT: %s",
		s.cfg.GRPCServices.WidgetsPort,
	)

	// recommendations
	recTarget := fmt.Sprintf(
		"%s:%s", s.cfg.GRPCServices.RecHost,
		s.cfg.GRPCServices.RecPort,
	)
	recConn, err := grpc.Dial(
		recTarget, grpc.WithTransportCredentials(
			insecure.NewCredentials(),
		),
	)
	if err != nil {
		s.logger.Errorf("rec client error: %s", err.Error())
		os.Exit(1)
	}
	defer recConn.Close()

	s.recConn = recConn
	s.logger.Infof(
		"rec client is connected to PORT: %s",
		s.cfg.GRPCServices.RecPort,
	)

	// API server
	s.fiber = fiber.New(
		fiber.Config{
			ReadTimeout: time.Second * s.cfg.Server.ReadTimeout,
		},
	)

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

	ctx, shutdown := context.WithTimeout(
		context.Background(), ctxTimeout*time.Second,
	)
	defer shutdown()

	s.logger.Info("server Exited Properly")
	return s.fiber.Server().ShutdownWithContext(ctx)
}
