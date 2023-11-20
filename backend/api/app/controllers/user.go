package controllers

import (
	"context"

	"github.com/gofiber/fiber/v2"

	"github.com/studsch/cool-app/backend/platform/database"
)

func UserWithPhoneExist(c *fiber.Ctx) error {
	phone := c.Params("phone")

	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	_, err = db.GetUserByPhone(context.Background(), phone)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":  true,
			"msg":    "user with the given phone is not found",
			"status": "not exist",
		})
	}

	return c.JSON(fiber.Map{
		"error":  false,
		"msg":    nil,
		"status": "exist",
	})
}
func UserWithLoginExist(c *fiber.Ctx) error {
	login := c.Params("login")

	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	_, err = db.GetUserByLogin(context.Background(), login)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":  true,
			"msg":    "user with the given login is not found",
			"status": "not exist",
		})
	}

	return c.JSON(fiber.Map{
		"error":  false,
		"msg":    nil,
		"status": "exist",
	})
}
