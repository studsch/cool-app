package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/pkg/errors"
	"google.golang.org/grpc"

	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/widgets"
	pb "github.com/studsch/cool-app/backend/pkg/genproto/widgets"
	"github.com/studsch/cool-app/backend/pkg/logger"
)

type grpcRepo struct {
	client pb.WidgetsServiceClient
}

func NewGrpcRepo(
	conn *grpc.ClientConn, log logger.Logger,
) widgets.GrpcRepository {
	return &grpcRepo{
		client: pb.NewWidgetsServiceClient(conn),
	}
}

func (r *grpcRepo) GetMostLikedUserInfoByUserId(
	ctx context.Context, userID uuid.UUID,
) (*models.MiniUser, error) {
	res, err := r.client.GetMostLikedUserInfoByUserId(
		ctx, &pb.GetMostLikedUserInfoByUserIdRequest{
			CurrentUserId: userID.String(),
		},
	)
	if err != nil {
		return nil, errors.Wrap(err, "GetMostLikedUserInfoByUserId")
	}

	inGetUserInfo := res.GetUserInfo()

	resID, err := uuid.Parse(inGetUserInfo.Id)
	if err != nil {
		return nil, errors.Wrap(err, "GetMostLikedUserInfoByUserId.Parse")
	}
	userInfo := &models.MiniUser{
		ID:        resID,
		FirstName: inGetUserInfo.FirstName,
		LastName:  inGetUserInfo.LastName,
		Login:     inGetUserInfo.Login,
		Avatar:    &inGetUserInfo.Avatar,
	}

	return userInfo, nil
}

func (r *grpcRepo) GetMostLikedTagByUserId(
	ctx context.Context, userID uuid.UUID,
) (*models.Tag, error) {
	res, err := r.client.GetMostLikedTagByUserId(
		ctx, &pb.GetMostLikedTagByUserIdRequest{
			CurrentUserId: userID.String(),
		},
	)
	if err != nil {
		return nil, errors.Wrap(err, "GetMostLikedTagByUserId")
	}
	inGetTagInfo := res.GetTagInfo()

	resID, err := uuid.Parse(inGetTagInfo.Id)
	if err != nil {
		return nil, errors.Wrap(err, "GetMostLikedTagByUserId.Parse")
	}
	tag := &models.Tag{
		Title: inGetTagInfo.Title,
		ID:    resID,
	}

	return tag, nil
}

func (r *grpcRepo) GetMostViewedUserInfoByUserId(
	ctx context.Context, userID uuid.UUID,
) (*models.MiniUser, error) {
	res, err := r.client.GetMostViewedUserInfoByUserId(
		ctx, &pb.GetMostViewedUserInfoByUserIdRequest{
			CurrentUserId: userID.String(),
		},
	)
	if err != nil {
		return nil, errors.Wrap(err, "GetMostViewedUserInfoByUserId")
	}
	inGetUserInfo := res.GetUserInfo()

	resID, err := uuid.Parse(inGetUserInfo.Id)
	if err != nil {
		return nil, errors.Wrap(err, "GetMostViewedUserInfoByUserId.Parse")
	}
	userInfo := &models.MiniUser{
		ID:        resID,
		FirstName: inGetUserInfo.FirstName,
		LastName:  inGetUserInfo.LastName,
		Login:     inGetUserInfo.Login,
		Avatar:    &inGetUserInfo.Avatar,
	}

	return userInfo, nil
}
