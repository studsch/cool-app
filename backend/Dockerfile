FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64 config=docker
RUN go build -ldflags="-s -w" -o /app/main cmd/api/main.go

FROM alpine:3.9

WORKDIR /app

ENV config=docker
COPY config/config-docker.yaml ./config/config-docker.yaml
COPY docs/swagger.yaml ./docs/swagger.yaml

COPY --from=builder /app/main ./main

EXPOSE 8000

CMD ["/app/main"]
