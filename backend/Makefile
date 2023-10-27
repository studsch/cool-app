MIGRATIONS_FOLDER = $(PWD)/platform/migrations
PSQL_URL = postgres://M:cool-app@localhost:5432/postgres?sslmode=disable

migrate.up:
	migrate -path $(MIGRATIONS_FOLDER) -database "$(PSQL_URL)" up

migrate.down:
	migrate -path $(MIGRATIONS_FOLDER) -database "$(PSQL_URL)" down

migrate.force:
	migrate -path $(MIGRATIONS_FOLDER) -database "$(PSQL_URL)" force

db.up:
	docker-compose up

db.rm:
	docker-compose stop \
	&& docker-compose rm \
	&& rm -rf ./db/postgres \
	&& rm -rf ./db/mongodb
