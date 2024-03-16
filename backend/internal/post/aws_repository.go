package post

import (
	"context"
	"net/url"

	"github.com/minio/minio-go/v7"
	"github.com/studsch/cool-app/backend/internal/models"
)

type AWSRepository interface {
	PutObject(ctx context.Context, input models.UploadInput) (*minio.UploadInfo, error)
	GetAWSMinioURL(ctx context.Context, bucket string, key string) (*url.URL, error)
}
