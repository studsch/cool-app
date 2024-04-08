package http

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/user"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

type userHandlers struct {
	cfg    *config.Config
	userUC user.UseCase
	log    logger.Logger
}

func NewUserHandlers(
	cfg *config.Config, userUC user.UseCase, log logger.Logger,
) user.Handlers {
	return &userHandlers{
		cfg:    cfg,
		userUC: userUC,
		log:    log,
	}
}

func (h *userHandlers) Follow() fiber.Handler {
	return func(c *fiber.Ctx) error {
		follow := &models.UserFollow{}
		if err := c.BodyParser(follow); err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		newFollow, err := h.userUC.FollowToUser(c.UserContext(), follow)
		if err != nil {
			fmt.Println(err)
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			fmt.Println(status, msg)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusCreated).JSON(newFollow)
	}
}

func (h *userHandlers) Unfollow() fiber.Handler {
	return func(c *fiber.Ctx) error {
		followUserID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		follow := &models.UserFollow{
			FollowToUserID: followUserID,
		}

		if err := h.userUC.UnfollowUser(c.UserContext(), follow); err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.SendStatus(fiber.StatusOK)
	}
}

func (h *userHandlers) UpdateNotification() fiber.Handler {
	return func(c *fiber.Ctx) error {
		followUserID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		notificationOn, err := strconv.ParseBool(c.Query("notificationOn"))
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		follow := &models.UserFollow{
			FollowToUserID: followUserID,
			NotificationOn: notificationOn,
		}

		updatedFollow, err := h.userUC.UpdateNotification(
			c.UserContext(), follow,
		)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(updatedFollow)
	}
}

func (h *userHandlers) GetSubscriptions() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := uuid.Parse(c.Params("userID"))
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		usersList, err := h.userUC.GetSubscriptions(c.UserContext(), userID)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		for _, value := range *usersList {
			fmt.Println(value.FirstName)
		}

		return c.Status(fiber.StatusOK).JSON(
			fiber.Map{
				"errors":     false,
				"users":      *usersList,
				"totalCount": len(*usersList),
			},
		)
	}
}
