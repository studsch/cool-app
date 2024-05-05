package main

import (
	"context"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/studsch/cool-app/backend/pkg/genproto/rec"
)

func main() {
	conn, err := grpc.Dial(
		"localhost:50051", grpc.WithTransportCredentials(
			insecure.NewCredentials(),
		),
	)
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()

	c := rec.NewRecSystemClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	r, err := c.ExecuteDataToFiles(ctx, &emptypb.Empty{})
	if err != nil {
		log.Fatalf("could not execute data: %v", err)
	}
	log.Println(r.String())
}
