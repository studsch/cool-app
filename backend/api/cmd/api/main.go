package main

import (
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/server"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"log"
)

func main() {
	cfg := &config.Config{
		Server: config.ServerConfig{
			AppVersion:  "1",
			Host:        "0.0.0.0",
			Port:        "8000",
			ReadTimeout: "60",
			Mode:        "Development",
		},
		Logger: config.Logger{
			Development:       true,
			DisableCaller:     false,
			DisableStacktrace: false,
			Encoding:          "json",
			Level:             "info",
		},
	}

	appLogger := logger.NewApiLogger(cfg)

	appLogger.InitLogger()
	appLogger.Infof("App version: %s, LogLevel: %s, Mode: %s", cfg.Server.AppVersion, cfg.Logger.Level, cfg.Server.Mode)

	s := server.NewServer(cfg, appLogger)
	if err := s.Run(); err != nil {
		log.Fatal(err)
	}
}
