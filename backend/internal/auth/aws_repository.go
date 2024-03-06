package auth

import (
	"context"
	"net/url"

	"github.com/minio/minio-go/v7"
	"github.com/studsch/cool-app/backend/internal/models"
)

type AWSRepository interface {
	PutObject(ctx context.Context, input models.UploadInput) (*minio.UploadInfo, error)
	GetObject(ctx context.Context, bucket string, fileName string) (*minio.Object, error)
	RemoveObject(ctx context.Context, bucket string, fileName string) error
	GenerateAWSMinioURL(ctx context.Context, bucket string, key string) (*url.URL, error)
}
