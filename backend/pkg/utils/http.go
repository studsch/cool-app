package utils

import (
	"context"
	"mime/multipart"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
)

// GetRequestID Get request id from context
func GetRequestID(c *fiber.Ctx) string {
	return c.GetRespHeader(fiber.HeaderXRequestID)
}

// GetIPAddress Get user IP address
func GetIPAddress(c *fiber.Ctx) string {
	return c.IP()
}

// GetConfigPath Get config path for local or docker
func GetConfigPath(configPath string) string {
	if configPath == "docker" {
		return "./config/config-docker"
	}
	return "./config/config-local"
}

// ReadRequest Read request body and validate
func ReadRequest(c *fiber.Ctx, request interface{}) error {
	if err := c.BodyParser(request); err != nil {
		return err
	}
	return validate.StructCtx(c.Context(), request)
}

func ReadImage(c *fiber.Ctx, field string) (*multipart.FileHeader, error) {
	image, err := c.FormFile(field)
	if err != nil {
		return nil, errors.WithMessage(err, "ctx.FromFile")
	}

	if err = CheckImageContentType(image); err != nil {
		return nil, err
	}

	return image, nil
}

// LogResponseError Logging error response
func LogResponseError(c *fiber.Ctx, logger logger.Logger, err error) {
	logger.Errorf(
		"ErrResponseWithLog, RequestID: %s, IPAdress: %s, Error: %s",
		GetRequestID(c),
		GetIPAddress(c),
		err,
	)
}

// UserCtxKey is a key used for the User object in the context
type UserCtxKey struct{}

// GetUserFromCtx Get user from context
func GetUserFromCtx(ctx context.Context) (*models.User, error) {
	user, ok := ctx.Value(UserCtxKey{}).(*models.User)
	if !ok {
		return nil, httpErrors.Unauthorized
	}

	return user, nil
}

var allowedImagesContentTypes = map[string]string{
	"image/bmp":                "bmp",
	"image/gif":                "gif",
	"image/png":                "png",
	"image/jpeg":               "jpeg",
	"image/jpg":                "jpg",
	"image/svg+xml":            "svg",
	"image/webp":               "webp",
	"image/tiff":               "tiff",
	"image/vnd.microsoft.icon": "ico",
}

func CheckImageFileContentType(fileContent []byte) (string, error) {
	contentType := http.DetectContentType(fileContent)

	extension, ok := allowedImagesContentTypes[contentType]
	if !ok {
		return "", errors.New("this content type is not allowed")
	}

	return extension, nil
}
