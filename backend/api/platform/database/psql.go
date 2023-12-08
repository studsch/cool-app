package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	pgxUUID "github.com/vgarvardt/pgx-google-uuid/v5"

	"github.com/studsch/cool-app/backend/pkg/configs"
)

func PGXPoolConnection() (*pgxpool.Pool, error) {
	uri := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		configs.Config("POSTGRES_USER"),
		configs.Config("POSTGRES_PASSWORD"),
		// "localhost",
		configs.Config("POSTGRES_HOST"),
		configs.Config("POSTGRES_PORT"),
		configs.Config("POSTGRES_DB_NAME"),
		configs.Config("POSTGRES_SSL_MODE"),
	)

	pgxConfig, err := pgxpool.ParseConfig(uri)
	if err != nil {
		panic(err)
	}

	pgxConfig.AfterConnect = func(_ context.Context, c *pgx.Conn) error {
		pgxUUID.Register(c.TypeMap())
		return nil
	}

	dbpool, err := pgxpool.NewWithConfig(context.TODO(), pgxConfig)
	if err != nil {
		panic(err)
	}

	if err := dbpool.Ping(context.Background()); err != nil {
		defer dbpool.Close()
		return nil, fmt.Errorf("not sent ping to database,  %w", err)
	}

	return dbpool, nil
}
