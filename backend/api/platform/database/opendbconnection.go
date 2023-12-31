package database

import (
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/studsch/cool-app/backend/app/queries"
)

type Queries struct {
	*queries.UserQueries
	*queries.PostQueries
	*queries.CommentQueries
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
		UserQueries:    &queries.UserQueries{Pool: db},
		PostQueries:    &queries.PostQueries{Pool: db},
		CommentQueries: &queries.CommentQueries{Pool: db},
	}, nil
}
