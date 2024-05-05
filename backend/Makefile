migrate-up:
	docker-compose --env-file="api/.env" --profile tools run --rm migrate up

migrate-down:
	docker-compose --env-file="api/.env" --profile tools run --rm migrate down 1

migrate-create:
	docker-compose --env-file="api/.env" --profile tools run --rm migrate create -ext sql -dir /migrations $(name)

build:
	docker build -t backend:local .

docker-up:
	docker-compose --env-file="api/.env" up --build

docker-rm:
	docker-compose --env-file="api/.env" rm

psql-rm:
	rm -rf ./data/postgres

develop:
	echo "Starting docker environment"
	docker-compose -f docker-compose.dev.yaml up --build

migrate:
	docker-compose -f docker-compose.dev.yaml --profile tools run --rm migrate up

generate:
	protoc -I ../proto ../proto/rec/rec.proto \
	--go_out=./pkg/genproto \
	--go_opt=paths=source_relative \
	--go-grpc_out=./pkg/genproto \
	--go-grpc_opt=paths=source_relative
