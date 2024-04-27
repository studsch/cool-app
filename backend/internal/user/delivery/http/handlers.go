package http

import (
	"fmt"
	"strconv"
	"time"

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
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
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

		return c.Status(fiber.StatusOK).JSON(
			fiber.Map{
				"errors":     false,
				"users":      *usersList,
				"totalCount": len(*usersList),
			},
		)
	}
}

func (h *userHandlers) GetSubscriptionsCount() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := uuid.Parse(c.Params("userID"))
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		count, err := h.userUC.GetUserSubscriptionsCount(
			c.UserContext(), userID,
		)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(
			fiber.Map{
				"errors":             false,
				"countSubscriptions": count,
			},
		)
	}
}

func (h *userHandlers) GetSubscribersCount() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := uuid.Parse(c.Params("userID"))
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		count, err := h.userUC.GetUserSubscribersCount(
			c.UserContext(), userID,
		)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(
			fiber.Map{
				"errors":             false,
				"countSubscriptions": count,
			},
		)
	}
}

func (h *userHandlers) Search() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		q := c.Query("q")
		orderBy := c.Query("orderBy")
		gender := c.Query("gender")
		city := c.Query("city")
		country := c.Query("country")
		ageStart := c.Query("ageStart")
		ageEnd := c.Query("ageEnd")

		var dateStart time.Time
		var dateEnd time.Time

		if ageStart != "" && ageEnd != "" {
			as, err := strconv.Atoi(ageStart)
			if err != nil {
				utils.LogResponseError(c, h.log, err)
				status, msg := httpErrors.ErrorResponse(fmt.Errorf("ageStart must be number"))
				return c.Status(status).JSON(msg)
			}

			ae, err := strconv.Atoi(ageEnd)
			if err != nil {
				utils.LogResponseError(c, h.log, err)
				status, msg := httpErrors.ErrorResponse(fmt.Errorf("ageEnd must be number"))
				return c.Status(status).JSON(msg)
			}

			if as == 0 || ae == 0 || as > ae {
				utils.LogResponseError(c, h.log, err)
				status, msg := httpErrors.ErrorResponse(fmt.Errorf("ageStart must be less than ageEnd"))
				return c.Status(status).JSON(msg)
			} else {
				currentDate := time.Now().Year()
				birthYearStart := currentDate - int(ae)
				brithYearEnd := currentDate - int(as)

				dateStart = time.Date(
					birthYearStart, time.January, 1, 0, 0, 0, 0, time.UTC,
				)
				dateEnd = time.Date(
					brithYearEnd, time.January, 1, 0, 0, 0, 0, time.UTC,
				)
			}
		}

		pq, err := utils.GetPaginationFromCtx(c)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		userFilters := &models.UserFilter{
			DateStart: &dateStart,
			DateEnd:   &dateEnd,
			Q:         q,
			OrderBy:   orderBy,
			Gender:    gender,
			City:      city,
			Country:   country,
		}

		usersList, err := h.userUC.SearchByFilter(
			c.UserContext(), userFilters, pq,
		)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(usersList)
	}
}

func (h *userHandlers) GetRecommendedUsers() fiber.Handler {
	return func(c *fiber.Ctx) error {
		recUsers, err := h.userUC.GetRecommendedUsers(c.UserContext())
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(
			fiber.Map{
				"errors": false,
				"recs":   recUsers,
			},
		)
	}
}

func (h *userHandlers) GetFriends() fiber.Handler {
	return func(c *fiber.Ctx) error {
		friends, err := h.userUC.GetFriends(c.UserContext())
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(
			fiber.Map{
				"errors":       false,
				"users":        friends,
				"friendsCount": len(*friends),
			},
		)
	}
}

func (h *userHandlers) GetMiniUserByID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := uuid.Parse(c.Params("userID"))
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		userByID, err := h.userUC.GetMiniUsersByID(c.UserContext(), userID)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(
			fiber.Map{
				"errors": false,
				"user":   userByID,
			},
		)
	}
}

func (h *userHandlers) CheckUserWithPhoneExists() fiber.Handler {
	return func(c *fiber.Ctx) error {
		phone := c.Params("phone")
		if len(phone) == 0 {
			return c.Status(fiber.StatusOK).JSON(
				fiber.Map{
					"errors": "no phone number given",
				},
			)
		}

		exists, err := h.userUC.CheckUserWithPhoneExists(c.UserContext(), phone)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(
			fiber.Map{
				"errors":     false,
				"userExists": exists,
			},
		)
	}
}

func (h *userHandlers) CheckUserWithLoginExists() fiber.Handler {
	return func(c *fiber.Ctx) error {
		login := c.Params("login")
		if len(login) == 0 {
			return c.Status(fiber.StatusOK).JSON(
				fiber.Map{
					"errors": "no login given",
				},
			)
		}

		exists, err := h.userUC.CheckUserWithLoginExists(c.UserContext(), login)
		if err != nil {
			utils.LogResponseError(c, h.log, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(
			fiber.Map{
				"errors":     false,
				"userExists": exists,
			},
		)
	}
}
