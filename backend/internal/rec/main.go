package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
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
		slog.Error("grpc.Dial", "error", err)
		os.Exit(1)
	}
	defer conn.Close()

	c := rec.NewRecSystemClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	_, err = c.ExecuteDataToFiles(ctx, &emptypb.Empty{})
	if err != nil {
		slog.Error("ExecuteDataToFiles", "error", err)
		os.Exit(1)
	}

	type Model struct {
		Name  string
		Type  uint32
		Valid bool
	}

	models := []Model{
		{
			Name:  "rs v1.1.1",
			Type:  1,
			Valid: true,
		},
		{
			Name:  "rs v1.1.2",
			Type:  2,
			Valid: true,
		},
		{
			Name:  "rs v1.1.3",
			Type:  3,
			Valid: true,
		},
		{
			Name:  "rs v1.2.1",
			Type:  1,
			Valid: false,
		},
		{
			Name:  "rs v1.2.2",
			Type:  2,
			Valid: false,
		},
		{
			Name:  "rs v1.2.3",
			Type:  3,
			Valid: false,
		},
	}

	for _, m := range models {
		fmt.Println(m)
	}

	// deleting existring models
	for _, m := range models {
		_, err = c.DeleteModelFromFiles(ctx, &rec.DeleteModelFromFilesRequest{
			Name: m.Name,
		})
		if err != nil {
			slog.Error("DeleteModelFromFiles", "name", m.Name, "error", err)
		}
	}

	// train models
	for _, m := range models {
		_, err = c.TrainModel(ctx, &rec.TrainModelRequest{
			Name:  m.Name,
			Type:  m.Type,
			Valid: m.Valid,
		})
		if err != nil {
			slog.Error("TrainModel", "name", m.Name, "error", err)
		}
	}

	// validate
	for i := 0; i < 3; i++ {
		res, err := c.ValidateModel(ctx, &rec.ValidateModelRequest{
			Name: models[i].Name,
		})
		if err != nil {
			slog.Error("ValidateModel", "name", models[i].Name, "error", err)
		}
		slog.Info("ValidateModel", "name", models[i].Name, "result", res)
	}

	// set models
	for i := 3; i < 6; i++ {
		_, err = c.SetModel(ctx, &rec.SetModelRequest{
			Name: models[i].Name,
			Type: models[i].Type,
		})
		if err != nil {
			slog.Error("SetModel", "name", models[i].Name, "error", err)
		}
	}

	// predict (непонятный ответ....)
	userID := "f284a3bd-35d3-4c5c-b48b-e683cd923248"
	res, err := c.PredictPostsForOneUser(ctx, &rec.PredictPostsForOneUserRequest{
		UserId: userID,
	})
	if err != nil {
		slog.Error("PredictPostsForOneUser", "userID", userID, "error", err)
	} else {
		for range res.Data {
			fmt.Println(res.Data)
		}
	}
	slog.Info("predicted posts", "response", res)
}
