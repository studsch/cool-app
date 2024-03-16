package middleware

import (
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/pkg/logger"
)

// MiddlewareManager middleware manager
type MiddlewareManager struct {
	authUC  auth.UseCase
	cfg     *config.Config
	origins []string
	logger  logger.Logger
}

func NewMiddlewareManager(authUC auth.UseCase, cfg *config.Config, origins []string, logger logger.Logger) *MiddlewareManager {
	return &MiddlewareManager{
		authUC:  authUC,
		cfg:     cfg,
		origins: origins,
		logger:  logger,
	}
}
