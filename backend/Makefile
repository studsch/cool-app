migrate-up:
	docker-compose --env-file="api/.env" --profile tools run --rm migrate up

migrate-down:
	docker-compose --env-file="api/.env" --profile tools run --rm migrate down 1

migrate-create:
	docker-compose --env-file="api/.env" --profile tools run --rm migrate create -ext sql -dir /migrations $(name)

build:
	docker build -t backend:local .

docker-up:
	docker-compose --env-file="api/.env" up

docker-rm:
	docker-compose --env-file="api/.env" rm

psql-rm:
	rm -rf ./data/postgres
