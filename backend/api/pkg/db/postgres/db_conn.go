package postgres

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/studsch/cool-app/backend/config"
	pgxUUID "github.com/vgarvardt/pgx-google-uuid/v5"
)

func NewPsqlDB(c *config.Config) (*pgxpool.Pool, error) {
	dataSourceName := fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s sslmode=%s pool_max_conns=10",
		c.Postgres.User,
		c.Postgres.Password,
		c.Postgres.Host,
		c.Postgres.Port,
		c.Postgres.DBName,
		c.Postgres.SSLMode,
	)

	pgxConfig, err := pgxpool.ParseConfig(dataSourceName)
	if err != nil {
		return nil, err
	}

	pgxConfig.AfterConnect = func(_ context.Context, conn *pgx.Conn) error {
		pgxUUID.Register(conn.TypeMap())
		return nil
	}
	db, err := pgxpool.NewWithConfig(context.TODO(), pgxConfig)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(context.Background()); err != nil {
		defer db.Close()
		return nil, err
	}

	return db, nil
}
