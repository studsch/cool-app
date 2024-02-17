package main

import (
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/server"
	"log"
)

func main() {
	cfg := &config.Config{
		Server: config.ServerConfig{
			Host:        "0.0.0.0",
			Port:        "8000",
			ReadTimeout: "60",
		},
	}

	s := server.NewServer(cfg)
	if err := s.Run(); err != nil {
		log.Fatal(err)
	}
}
