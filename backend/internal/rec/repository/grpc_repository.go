package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/rec"
	pb "github.com/studsch/cool-app/backend/pkg/genproto/rec"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
)

type grpcRepo struct {
	client pb.RecSystemClient
}

func NewGrpcRepo(
	conn *grpc.ClientConn,
) rec.GrpcRepository {
	return &grpcRepo{
		client: pb.NewRecSystemClient(conn),
	}
}

func (r *grpcRepo) ExecuteDataToFiles(ctx context.Context) error {
	_, err := r.client.ExecuteDataToFiles(ctx, &emptypb.Empty{})
	if err != nil {
		return err
	}

	return nil
}

func (r *grpcRepo) DeleteModelFromFiles(
	ctx context.Context, name string,
) error {
	_, err := r.client.DeleteModelFromFiles(ctx, &pb.DeleteModelFromFilesRequest{Name: name})
	if err != nil {
		return err
	}

	return nil
}

func (r *grpcRepo) TrainModel(ctx context.Context, m *models.RecModel) error {
	_, err := r.client.TrainModel(ctx, &pb.TrainModelRequest{
		Name:  m.Name,
		Type:  m.Type,
		Valid: m.Valid,
	})
	if err != nil {
		return err
	}

	return nil
}

func (r *grpcRepo) ValidateModel(ctx context.Context, name string) error {
	_, err := r.client.ValidateModel(ctx, &pb.ValidateModelRequest{Name: name})
	if err != nil {
		return err
	}

	return nil
}

func (r *grpcRepo) SetModel(ctx context.Context, m *models.RecModel) error {
	_, err := r.client.SetModel(ctx, &pb.SetModelRequest{
		Name: m.Name,
		Type: m.Type,
	})
	if err != nil {
		return err
	}

	return nil
}

func (r *grpcRepo) PredictPostsForOneUser(
	ctx context.Context, userID uuid.UUID,
) (models.DataMap, error) {
	predict, err := r.client.PredictPostsForOneUser(
		ctx, &pb.PredictPostsForOneUserRequest{
			UserId: userID.String(),
		},
	)
	if err != nil {
		return nil, err
	}

	data := make(models.DataMap)

	for key, value := range predict.Data {
		data[key] = models.Values{
			PostsIDs: value.Values,
		}
	}
	return data, nil
}
