package database

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/studsch/cool-app/backend/app/queries"
)

type Queries struct {
	*queries.UserQueries
}

func OpenDBConnection() (*Queries, error) {
	var (
		db  *pgxpool.Pool
		err error
	)

	db, err = PGXPoolConnection()

	if err != nil {
		return nil, err
	}

	return &Queries{
		UserQueries: &queries.UserQueries{Pool: db},
	}, nil
}
