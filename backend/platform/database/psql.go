package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/studsch/cool-app/backend/pkg/configs"
)

func PGXPoolConnection() (*pgxpool.Pool, error) {
	url := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		"localhost",
		configs.Config("POSTGRES_PORT"),
		configs.Config("POSTGRES_USER"),
		configs.Config("POSTGRES_PASSWORD"),
		"postgres",
		configs.Config("POSTGRES_SSL_MODE"),
	)

	dbpool, err := pgxpool.New(context.Background(), url)
	if err != nil {
		return nil, fmt.Errorf("Unable to create connection pool: %w\n", err)
	}

	if err := dbpool.Ping(context.Background()); err != nil {
		defer dbpool.Close()
		return nil, fmt.Errorf("Not sent ping to database,  %w", err)
	}

	return dbpool, nil
}
