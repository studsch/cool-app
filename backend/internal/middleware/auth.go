package middleware

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

func (mw *MiddlewareManager) AuthJWTMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenMetadata, err := utils.ExtractTokenMetadata(c, mw.cfg)
		if err != nil {
			mw.logger.Error("auth middleware", err)
			return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		}

		userUUID, err := uuid.Parse(tokenMetadata.ID)
		if err != nil {
			mw.logger.Error("auth middleware", err)
			return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		}

		u, err := mw.authUC.GetByID(c.Context(), userUUID)
		if err != nil {
			mw.logger.Error("auth middleware", err)
			return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		}

		c.Locals("user", u)
		ctx := context.WithValue(c.Context(), utils.UserCtxKey{}, u)
		c.SetUserContext(ctx)

		//bearerHeader := c.Get("Authorization")
		//
		//if bearerHeader == "" {
		//	mw.logger.Error("auth middleware", zap.String("bearerHeader", bearerHeader))
		//	return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		//}
		//
		//mw.logger.Infof("auth middleware bearerHeader %s", bearerHeader)
		//
		//headerParts := strings.Split(bearerHeader, " ")
		//if len(headerParts) != 2 {
		//	mw.logger.Error("auth middleware", zap.String("headerParts", "len(headerParts) != 2"))
		//	return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		//}
		//
		//tokenString := headerParts[1]
		//
		//if err := mw.validateJWT(tokenString, authUC, c, cfg); err != nil {
		//	mw.logger.Error("middleware validateJWT", zap.String("headerJWT", err.Error()))
		//	return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		//}

		return c.Next()
	}
}

func (mw *MiddlewareManager) validateJWT(tokenString string, c *fiber.Ctx) error {
	if tokenString == "" {
		return httpErrors.InvalidJWTToken
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signin method %v", token.Header["alg"])
		}
		secret := []byte(mw.cfg.JWT.SecretKey)
		return secret, nil
	})
	if err != nil {
		return err
	}

	if !token.Valid {
		return httpErrors.InvalidJWTToken
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, ok := claims["id"].(string)
		if !ok {
			return httpErrors.InvalidJWTClaims
		}

		userUUID, err := uuid.Parse(userID)
		if err != nil {
			return err
		}

		u, err := mw.authUC.GetByID(c.Context(), userUUID)
		if err != nil {
			return err
		}

		// c.Locals("user", u)
		// TODO: or
		ctx := context.WithValue(c.Context(), utils.UserCtxKey{}, u)
		c.SetUserContext(ctx)
	}

	return nil
}

func (mw *MiddlewareManager) OwnerMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, err := utils.GetUserFromCtx(c.UserContext())
		if err != nil {
			mw.logger.Error("auth middleware", err)
			return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		}

		if user.ID.String() != c.Params("id") {
			mw.logger.Errorf("auth middleware, not owner")
			return c.Status(http.StatusForbidden).JSON(httpErrors.NewForbiddenError(httpErrors.Forbidden))
		}

		return c.Next()
	}
}
