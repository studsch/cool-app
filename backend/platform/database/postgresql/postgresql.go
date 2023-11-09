package postgresql

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/studsch/cool-app/backend/pkg/configs"
)

type Client interface {
	Exec(ctx context.Context, sql string, arguments ...any) (pgconn.CommandTag, error)
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
	Begin(ctx context.Context) (pgx.Tx, error)
}

func NewClient(ctx context.Context) (*pgxpool.Pool, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		configs.Config("POSTGRES_HOST"),
		configs.Config("POSTGRES_PORT"),
		configs.Config("POSTGRES_USER"),
		configs.Config("POSTGRES_PASSWORD"),
		configs.Config("POSTGRES_DB_NAME"),
		configs.Config("POSTGRES_SSL_MODE"),
	)

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, err
	}

	//maxAttempts, err := strconv.Atoi(configs.Config("MAX_ATTEMPTS"))
	//if err != nil {
	//	log.Printf("failed to convert max attempts value from config to int")
	//}
	//
	//err = utils.DoWithTries(func() error {
	//	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	//	defer cancel()
	//
	//	pool, err = pgxpool.New(ctx, dsn)
	//	if err != nil {
	//		return err
	//	}
	//
	//	return nil
	//}, maxAttempts, 5*time.Second)
	//if err != nil {
	//	log.Fatalf("error do with tries postgresql: %v", err)
	//}

	return pool, nil
}
