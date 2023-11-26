package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/app/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
	"github.com/studsch/cool-app/backend/platform/database"
)

func CreateComment(c *fiber.Ctx) error {
	now := time.Now().Unix()

	claims, err := utils.ExtractTokenMetadata(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	expires := claims.Expires
	if now > expires {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": true,
			"msg":   "unauthorized, check expiration time of your token",
		})
	}

	type createComment struct {
		UserID  uuid.UUID `validate:"required,uuid" json:"userID"`
		PostID  uuid.UUID `validate:"required,uuid" json:"postID"`
		Content string    `validate:"required,gte=1,lte=180" json:"content"`
	}
	newComment := &createComment{}

	if err := c.BodyParser(newComment); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	validate := utils.NewValidator()
	if err := validate.Struct(newComment); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   utils.ValidatorErrors(err),
		})
	}

	userID := claims.UserID
	if newComment.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": true,
			"msg":   "permission denied",
		})
	}

	comment := &models.Comment{
		UserID:  newComment.UserID,
		PostID:  newComment.PostID,
		Content: newComment.Content,
	}
	if err := db.CreateComment(c.Context(), comment); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error":   false,
		"msg":     nil,
		"comment": comment,
	})
}
