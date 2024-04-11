package http

import (
	"bytes"
	"fmt"
	"io"
	"strings"
	"time"
	"unicode"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/post"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// postHandlers Post handlers
type postHandlers struct {
	cfg    *config.Config
	postUC post.UseCase
	logger logger.Logger
}

// Search implements post.Handlers.
func (h *postHandlers) Search() fiber.Handler {
	return func(c *fiber.Ctx) error {
		q := c.Query("q")

		// get words without punctuation and others symbols
		words := strings.FieldsFunc(
			q, func(r rune) bool {
				return !unicode.IsLetter(r) && !unicode.IsDigit(r) && r != '#'
			},
		)

		var hashtags []string
		var otherWords []string

		for _, word := range words {
			if strings.HasPrefix(
				word, "#",
			) && (unicode.IsLetter(rune(word[len(word)-1])) || unicode.IsDigit(rune(word[len(word)-1]))) {
				w := strings.TrimLeft(word, "#")
				hashtags = append(hashtags, w)
				otherWords = append(otherWords, w)
			} else {
				otherWords = append(otherWords, word)
			}
		}

		qWords := strings.Join(otherWords, " ")

		orderBy := c.Query("orderBy")
		location := c.Query("location")
		createdAtString := c.Query("createdAt")

		var createdAt time.Time

		if createdAtString != "" {
			cAt, err := time.Parse("2006-01-02", createdAtString)
			if err != nil {
				utils.LogResponseError(c, h.logger, err)
				status, msg := httpErrors.ErrorResponse(fmt.Errorf("createdAt cannot parse"))
				return c.Status(status).JSON(msg)
			}

			createdAt = cAt
		}

		pq, err := utils.GetPaginationFromCtx(c)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		postFilters := &models.PostFilter{
			CreatedAt: &createdAt,
			Q:         qWords,
			OrderBy:   orderBy,
			Location:  location,
		}

		// postsList, err := h.postUC.Search(c.UserContext(), hashtags, qWords, pq)
		postsList, err := h.postUC.SearchByFilter(
			c.UserContext(), hashtags, postFilters, pq,
		)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(postsList)
	}
}

// GetImageURL implements post.Handlers.
func (h *postHandlers) GetImageURL() fiber.Handler {
	return func(c *fiber.Ctx) error {
		bucket := c.Params("bucket")
		key := c.Params("key")

		imageURL, err := h.postUC.GetImageURL(c.UserContext(), bucket, key)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).SendString(imageURL)
	}
}

// UploadImages implements post.Handlers.
func (h *postHandlers) UploadImages() fiber.Handler {
	return func(c *fiber.Ctx) error {
		postID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		bucket := c.Query("bucket")

		images, err := utils.ReadImages(c, "file")
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		var files []models.UploadInput
		for _, image := range images {
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

			files = append(
				files, models.UploadInput{
					File:        reader,
					Name:        image.Filename,
					ContentType: contentType,
					BucketName:  bucket,
					Size:        image.Size,
				},
			)
		}

		updatedPost, err := h.postUC.UploadImages(
			c.UserContext(), postID, files,
		)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(updatedPost)
	}
}

// NewPostHandlers Post handlers constructor
func NewPostHandlers(
	cfg *config.Config, postUC post.UseCase, logger logger.Logger,
) post.Handlers {
	return &postHandlers{
		cfg:    cfg,
		postUC: postUC,
		logger: logger,
	}
}

// Create Creates new post
func (h *postHandlers) Create() fiber.Handler {
	return func(c *fiber.Ctx) error {
		p := &models.Post{}
		if err := c.BodyParser(p); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		createdPost, err := h.postUC.Create(c.UserContext(), p)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusCreated).JSON(createdPost)
	}
}

// Update Updates post
func (h *postHandlers) Update() fiber.Handler {
	return func(c *fiber.Ctx) error {
		postID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		p := &models.Post{}
		if err := c.BodyParser(p); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}
		p.ID = postID

		updatedPost, err := h.postUC.Update(c.UserContext(), p)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(updatedPost)
	}
}

// Archive Archives post
func (h *postHandlers) Archive() fiber.Handler {
	return func(c *fiber.Ctx) error {
		postID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		if err := h.postUC.Archive(c.UserContext(), postID); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.SendStatus(fiber.StatusOK)
	}
}

// Delete Deletes post
func (h *postHandlers) Delete() fiber.Handler {
	return func(c *fiber.Ctx) error {
		postID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		if err := h.postUC.Delete(c.UserContext(), postID); err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.SendStatus(fiber.StatusOK)
	}
}

// GetPosts Get all posts
func (h *postHandlers) GetPosts() fiber.Handler {
	return func(c *fiber.Ctx) error {
		pq, err := utils.GetPaginationFromCtx(c)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		postsList, err := h.postUC.GetPosts(c.UserContext(), pq)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(postsList)
	}
}

// GetByID Get post by id
func (h *postHandlers) GetByID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		postID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		postByID, err := h.postUC.GetByID(c.UserContext(), postID)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(postByID)
	}
}

// GetByUserID Get posts by user id
func (h *postHandlers) GetByUserID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		pq, err := utils.GetPaginationFromCtx(c)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		postByUserID, err := h.postUC.GetByUserID(c.UserContext(), userID, pq)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(postByUserID)
	}
}

func (h *postHandlers) GetLikedPostsByUserID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		pq, err := utils.GetPaginationFromCtx(c)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		postByUserID, err := h.postUC.GetLikedPostsByUserID(c.UserContext(), pq)
		if err != nil {
			utils.LogResponseError(c, h.logger, err)
			status, msg := httpErrors.ErrorResponse(err)
			return c.Status(status).JSON(msg)
		}

		return c.Status(fiber.StatusOK).JSON(postByUserID)
	}
}

//
// func (h *postHandlers) AddTagsByTitles() fiber.Handler {
// 	return func(c *fiber.Ctx) error {
// 		type tagTitles struct {
// 			Tags []string `json:"tags"`
// 		}
//
// 		tags := new(tagTitles)
// 		if err := c.BodyParser(tags); err != nil {
// 			utils.LogResponseError(c, h.logger, err)
// 			status, msg := httpErrors.ErrorResponse(err)
// 			return c.Status(status).JSON(msg)
// 		}
//
// 		addedTags := make([]string, 0)
// 		for _, tag := range tags.Tags {
// 			t, err := h.postUC.AddTagByTitle(c.UserContext(), tag)
// 			if err != nil {
// 				utils.LogResponseError(c, h.logger, err)
// 				status, msg := httpErrors.ErrorResponse(err)
// 				return c.Status(status).JSON(msg)
// 			}
// 			if t.Title != "" {
// 				addedTags = append(addedTags, t.Title)
// 			}
// 		}
//
// 		return c.Status(fiber.StatusOK).JSON(fiber.Map{
// 			"addedTags": addedTags,
// 		})
// 	}
// }
