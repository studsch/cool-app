package repository

import (
	"context"
	"fmt"
	"net/url"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/internal/models"
)

type authAWSRepository struct {
	client *minio.Client
}

// GetObject implements auth.AWSRepository.
func (aws *authAWSRepository) GetObject(ctx context.Context, bucket string, fileName string) (*minio.Object, error) {
	object, err := aws.client.GetObject(ctx, bucket, fileName, minio.GetObjectOptions{})
	if err != nil {
		return nil, errors.Wrap(err, "authAWSRepository.FileDownload.GetObject")
	}
	return object, nil
}

func (aws *authAWSRepository) GenerateAWSMinioURL(ctx context.Context, bucket string, key string) (*url.URL, error) {
	reqParams := make(url.Values)
	attachment := fmt.Sprintf("attachment; filename=%s", key)
	reqParams.Set("response-content-disposition", attachment)

	presignedURL, err := aws.client.PresignedGetObject(ctx, bucket, key, time.Second*24*60*60, reqParams)
	if err != nil {
		return nil, errors.Wrap(err, "authAWSRepository.GenerateAWSMinioURL.PresignedGetObject")
	}
	fmt.Println("Successfully generated presigned URL", presignedURL)
	return presignedURL, nil
}

// PutObject implements auth.AWSRepository.
func (aws *authAWSRepository) PutObject(ctx context.Context, input models.UploadInput) (*minio.UploadInfo, error) {
	options := minio.PutObjectOptions{
		ContentType:  input.ContentType,
		UserMetadata: map[string]string{"x-amz-acl": "public-read"},
	}

	uploadInfo, err := aws.client.PutObject(ctx, input.BucketName, aws.generateFileName(input.Name), input.File, input.Size, options)
	if err != nil {
		return nil, errors.Wrap(err, "authAWSRepository.FileUpload.PutObject")
	}
	fmt.Println(uploadInfo)

	return &uploadInfo, err
}

// RemoveObject implements auth.AWSRepository.
func (aws *authAWSRepository) RemoveObject(ctx context.Context, bucket string, fileName string) error {
	if err := aws.client.RemoveObject(ctx, bucket, fileName, minio.RemoveObjectOptions{}); err != nil {
		return errors.Wrap(err, "authAWSRepository.RemoveObject")
	}
	return nil
}

func NewAuthAWSRepository(awsClient *minio.Client) auth.AWSRepository {
	return &authAWSRepository{client: awsClient}
}

func (aws *authAWSRepository) generateFileName(fileName string) string {
	uid := uuid.New().String()
	return fmt.Sprintf("%s-%s", uid, fileName)
}
