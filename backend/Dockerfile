FROM golang:1.21 AS builder

WORKDIR /usr/local/src

COPY api/go.mod api/go.sum ./
RUN go mod download

COPY api ./
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64
RUN go build -ldflags="-s -w" -o ./bin/app main.go

FROM alpine:3.18 AS runner

WORKDIR /

COPY api/.env ./
COPY --from=builder /usr/local/src/bin/app /app

ENTRYPOINT [ "/app" ]
