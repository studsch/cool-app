package controllers

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

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

	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	avatar := form.File["avatar"]
	if len(avatar) == 0 {
		signUp.Avatar = "default"
	} else if len(avatar) > 1 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   "so many files with field avatar",
		})
	} else {
		file := avatar[0]
		var fileName string
		if file.Size > 5*1000*1000 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": true,
				"msg":   "image is so big",
			})
		}
		// save only images
		if !strings.Contains(file.Header["Content-Type"][0], "image") {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": true,
				"msg":   "avatar can be only image files",
			})
		}
		fileName = fmt.Sprintf(
			"%s.%s",
			uuid.NewString(),
			strings.Split(file.Header["Content-Type"][0], "/")[1],
		)
		err = c.SaveFile(file, fmt.Sprintf("tmp/avatars/%s", fileName))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": true,
				"msg":   err.Error(),
			})
		}
		signUp.Avatar = fileName
	}

	dob, _ := time.Parse("02-01-2006", signUp.DateOfBirth)
	user := &models.User{
		Login:        signUp.Login,
		Phone:        signUp.Phone,
		PasswordHash: utils.GeneratePassword(signUp.Password),
		Name:         signUp.Name,
		Surname:      signUp.Surname,
		DateOfBirth:  dob,
		Gender:       signUp.Gender,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
		UserRole:     role,
		Deleted:      false,
		Avatar:       signUp.Avatar,
	}

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
	foundedUser.PasswordHash = ""

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
			"msg":   "user with the given login is not found",
		})
	}

	comparePassword := utils.ComparePasswords(foundedUser.PasswordHash, signIn.Password)
	if !comparePassword {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   "wrong user login or password",
		})
	}
	foundedUser.PasswordHash = ""

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
