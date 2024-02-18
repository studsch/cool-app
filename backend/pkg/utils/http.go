package utils

import (
	"github.com/gofiber/fiber/v2"
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

// LogResponseError Logging error response
func LogResponseError(c *fiber.Ctx, logger logger.Logger, err error) {
	logger.Errorf(
		"ErrResponseWithLog, RequestID: %s, IPAdress: %s, Error: %s",
		GetRequestID(c),
		GetIPAddress(c),
		err,
	)
}
