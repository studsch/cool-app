package controllers

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"

	"github.com/studsch/cool-app/backend/app/models"
	"github.com/studsch/cool-app/backend/pkg/utils"
	"github.com/studsch/cool-app/backend/platform/database"
)

func UserSignUp(c *fiber.Ctx) error {
	signUp := &models.SignUp{}

	if err := c.BodyParser(signUp); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	validate := utils.NewValidator()
	if err := validate.Struct(signUp); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   utils.ValidatorErrors(err),
		})
	}

	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	role, err := utils.VerifyRole(signUp.UserRole)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	user := &models.User{}
	user.Login = signUp.Login
	user.Phone = signUp.Phone
	user.PasswordHash = utils.GeneratePassword(signUp.Password)
	user.Name = signUp.Name
	user.Surname = signUp.Surname
	user.DateOfBirth, _ = time.Parse("02-01-2006", signUp.DateOfBirth)
	user.Gender = signUp.Gender
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	user.UserRole = role
	user.Deleted = false

	if err := validate.Struct(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   utils.ValidatorErrors(err),
		})
	}

	if err := db.CreateUser(context.Background(), user); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	user.PasswordHash = ""
	return c.JSON(fiber.Map{
		"error": false,
		"msg":   nil,
		"user":  user,
	})
}

func UserSignInPhone(c *fiber.Ctx) error {
	signIn := &models.SignInPhone{}

	if err := c.BodyParser(signIn); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	validate := utils.NewValidator()
	if err := validate.Struct(signIn); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   utils.ValidatorErrors(err),
		})
	}

	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	foundedUser, err := db.GetUserByPhone(context.Background(), signIn.Phone)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": true,
			"msg":   "user with the given phone is not found",
		})
	}

	comparePassword := utils.ComparePasswords(foundedUser.PasswordHash, signIn.Password)
	if !comparePassword {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   "wrong user phone or password",
		})
	}

	tokens, err := utils.GenerateNewTokens(foundedUser.ID.String())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	// TODO: save refresh token to Redis

	return c.JSON(fiber.Map{
		"error": false,
		"msg":   nil,
		"data":  foundedUser,
		"tokens": fiber.Map{
			"access":  tokens.Access,
			"refresh": tokens.Refresh,
		},
	})
}

func UserSignInLogin(c *fiber.Ctx) error {
	signIn := &models.SignInLogin{}

	if err := c.BodyParser(signIn); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	validate := utils.NewValidator()
	if err := validate.Struct(signIn); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   utils.ValidatorErrors(err),
		})
	}

	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	foundedUser, err := db.GetUserByLogin(context.Background(), signIn.Login)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": true,
			"msg":   "user with the given phone is not found",
		})
	}

	comparePassword := utils.ComparePasswords(foundedUser.PasswordHash, signIn.Password)
	if !comparePassword {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   "wrong user phone or password",
		})
	}

	tokens, err := utils.GenerateNewTokens(foundedUser.ID.String())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	// TODO: save refresh token to Redis

	return c.JSON(fiber.Map{
		"error": false,
		"msg":   nil,
		"data":  foundedUser,
		"tokens": fiber.Map{
			"access":  tokens.Access,
			"refresh": tokens.Refresh,
		},
	})
}

func UserSignOut(c *fiber.Ctx) error {
	claims, err := utils.ExtractTokenMetadata(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	userId := claims.UserID.String()
	fmt.Println(userId)

	// TODO: save refresh token to Redis

	return c.SendStatus(fiber.StatusNoContent)
}
