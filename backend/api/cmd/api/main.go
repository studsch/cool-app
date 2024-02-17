package main

import (
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/server"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
	"log"
	"os"
)

func main() {
	configPath := utils.GetConfigPath(os.Getenv("config"))
	println(configPath)
	cfgFile, err := config.LoadConfig(configPath)
	if err != nil {
		log.Fatalf("LoadConfig: %v", err)
	}

	cfg, err := config.ParseConfig(cfgFile)
	if err != nil {
		log.Fatalf("ParseConfig: %v", err)
	}

	appLogger := logger.NewApiLogger(cfg)

	appLogger.InitLogger()
	appLogger.Infof("App version: %s, LogLevel: %s, Mode: %s", cfg.Server.AppVersion, cfg.Logger.Level, cfg.Server.Mode)

	s := server.NewServer(cfg, appLogger)
	if err := s.Run(); err != nil {
		log.Fatal(err)
	}
}
