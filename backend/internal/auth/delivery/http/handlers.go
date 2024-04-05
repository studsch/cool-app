package http

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/auth"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// authHandlers Auth handlers
type authHandlers struct {
	cfg    *config.Config
	authUC auth.UseCase
	logger logger.Logger
}

// Search implements auth.Handlers.
func (h *authHandlers) Search() func(*fiber.Ctx) error {
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
				utils.LogResponseError(c, h.logger, err)
				status, msg := httpErrors.ErrorResponse(fmt.Errorf("ageStart must be number"))
				return c.Status(status).JSON(msg)
			}

			ae, err := strconv.Atoi(ageEnd)
			if err != nil {
				utils.LogResponseError(c, h.logger, err)
				status, msg := httpErrors.ErrorResponse(fmt.Errorf("ageEnd must be number"))
				return c.Status(status).JSON(msg)
			}

			if as == 0 || ae == 0 || as > ae {
				utils.LogResponseError(c, h.logger, err)
				status, msg := httpErrors.ErrorResponse(fmt.Errorf("ageStart must be less than ageEnd"))
				return c.Status(status).JSON(msg)
			} else {
				currentDate := time.Now().Year()
				birthYearStart := currentDate - int(ae)
				brithYearEnd := currentDate - int(as)

				dateStart = time.Date(birthYearStart, time.January, 1, 0, 0, 0, 0, time.UTC)
				dateEnd = time.Date(brithYearEnd, time.January, 1, 0, 0, 0, 0, time.UTC)
			}
		}

		pq, err := utils.GetPaginationFromCtx(c)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
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

		// usersList, err := h.authUC.Search(c.UserContext(), q, pq)
		usersList, err := h.authUC.SearchByFilter(c.UserContext(), userFilters, pq)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(usersList)
	}
}

// NewAuthHandlers Auth handlers constructor
func NewAuthHandlers(cfg *config.Config, authUC auth.UseCase, logger logger.Logger) auth.Handlers {
	return &authHandlers{
		cfg:    cfg,
		authUC: authUC,
		logger: logger,
	}
}

// Register Register new user
func (h *authHandlers) Register() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := &models.User{}
		if err := utils.ReadRequest(c, user); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		createdUser, err := h.authUC.Register(c.Context(), user)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		// TODO: session

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"error": false,
			"user":  createdUser.User,
			"tokens": fiber.Map{
				"access":  createdUser.AccessToken,
				"refresh": createdUser.RefreshToken,
			},
		})
	}
}

// Login Log-in user
func (h *authHandlers) Login() fiber.Handler {
	// TODO: excluded_with - bug
	// required_without=PhoneNumber,excluded_with=PhoneNumber,
	// required_without=Login,excluded_with=Login,
	type Login struct {
		Login       string  `json:"login,omitempty" validate:"omitempty,gte=8,lte=30"`
		PhoneNumber *string `json:"phoneNumber,omitempty" validate:"omitempty,e164"`
		Password    string  `json:"password,omitempty" validate:"required,gte=8"`
	}
	return func(c *fiber.Ctx) error {
		login := &Login{}
		if err := utils.ReadRequest(c, login); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		userWithTokens, err := h.authUC.Login(c.Context(), &models.User{
			Login:       login.Login,
			PhoneNumber: login.PhoneNumber,
			Password:    login.Password,
		})
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"error": false,
			"user":  userWithTokens.User,
			"tokens": fiber.Map{
				"access":  userWithTokens.AccessToken,
				"refresh": userWithTokens.RefreshToken,
			},
		})
	}
}

// Logout Log-out user
func (h *authHandlers) Logout() fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, err := utils.ExtractTokenMetadata(c, h.cfg)
		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		}

		userID := claims.ID
		fmt.Println(userID)

		// TODO: connect to redis
		// TODO: delete refresh token in redis

		return c.SendStatus(fiber.StatusNoContent)
	}
}

func (h *authHandlers) UploadAvatar() fiber.Handler {
	return func(c *fiber.Ctx) error {
		bucket := c.Query("bucket")
		claims, err := utils.ExtractTokenMetadata(c, h.cfg)
		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		}

		uid, err := uuid.Parse(claims.ID)
		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(httpErrors.NewUnauthorizedError(httpErrors.Unauthorized))
		}

		image, err := utils.ReadImage(c, "file")
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		file, err := image.Open()
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}
		defer file.Close()

		binaryImage := bytes.NewBuffer(nil)
		if _, err = io.Copy(binaryImage, file); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		contentType, err := utils.CheckImageFileContentType(binaryImage.Bytes())
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		reader := bytes.NewReader(binaryImage.Bytes())

		updatedUser, err := h.authUC.UploadAvatar(c.UserContext(), uid, models.UploadInput{
			File:        reader,
			Name:        image.Filename,
			ContentType: contentType,
			BucketName:  bucket,
			Size:        image.Size,
		})
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(updatedUser)
	}
}

func (h *authHandlers) Update() fiber.Handler {
	return func(c *fiber.Ctx) error {
		uID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		user := &models.User{}
		user.ID = uID

		if err = utils.ReadRequest(c, user); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		updatedUser, err := h.authUC.Update(c.UserContext(), user)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(updatedUser)
	}
}
