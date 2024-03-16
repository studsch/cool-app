package repository

import (
	"context"
	"fmt"
	"net/url"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/post"
)

type postAWSRepository struct {
	client *minio.Client
}

// GetAWSMinioURL implements post.AWSRepository.
func (aws *postAWSRepository) GetAWSMinioURL(ctx context.Context, bucket string, key string) (*url.URL, error) {
	reqParams := make(url.Values)
	attachment := fmt.Sprintf("attachment; filename=%s", key)
	reqParams.Set("response-content-disposition", attachment)

	presignedURL, err := aws.client.PresignedGetObject(ctx, bucket, key, time.Second*24*60*60, reqParams)
	if err != nil {
		return nil, errors.Wrap(err, "postAWSRepository.GetAWSMinioURL")
	}
	return presignedURL, nil
}

// PutObject implements post.AWSRepository.
func (aws *postAWSRepository) PutObject(ctx context.Context, input models.UploadInput) (*minio.UploadInfo, error) {
	options := minio.PutObjectOptions{
		ContentType:  input.ContentType,
		UserMetadata: map[string]string{"x-amz-acl": "public-read"},
	}

	uploadInfo, err := aws.client.PutObject(ctx, input.BucketName, aws.generateFileName(input.Name), input.File, input.Size, options)
	if err != nil {
		return nil, errors.Wrap(err, "postAWSRepository.Fileupload.PutObject")
	}
	return &uploadInfo, err
}

func NewPostAWSRepository(awsClient *minio.Client) post.AWSRepository {
	return &postAWSRepository{client: awsClient}
}

func (aws *postAWSRepository) generateFileName(fileName string) string {
	uid := uuid.New().String()
	return fmt.Sprintf("%s-%s", uid, fileName)
}
