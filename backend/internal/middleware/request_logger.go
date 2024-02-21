package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/studsch/cool-app/backend/pkg/utils"
	"time"
)

func (mw *MiddlewareManager) RequestLoggerMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		err := c.Next()

		method := c.Method()
		uri := c.BaseURL()

		res := c.Response()
		status := res.StatusCode()
		// TODO: check this
		size := res.Header.ContentLength()

		s := time.Since(start).String()
		requestID := utils.GetRequestID(c)

		mw.logger.Infof("RequestID: %s, Method: %s, URI: %s, Status: %v, Size: %v, Time: %v",
			requestID, method, uri, status, size, s,
		)

		return err
	}
}
