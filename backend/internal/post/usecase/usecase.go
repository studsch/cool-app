package usecase

import (
	"context"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/studsch/cool-app/backend/config"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/post"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
	"github.com/studsch/cool-app/backend/pkg/utils"
)

// postUC Post useCase
type postUC struct {
	cfg      *config.Config
	postRepo post.Repository
	awsRepo  post.AWSRepository
	logger   logger.Logger
}

func (u *postUC) SearchByFilter(ctx context.Context, tags []string, filter *models.PostFilter, pq *utils.PaginationQuery) (*models.PostList, error) {
	return u.postRepo.SearchByFilter(ctx, tags, filter, pq)
}

// Search implements post.UseCase.
func (u *postUC) Search(ctx context.Context, tags []string, q string, pq *utils.PaginationQuery) (*models.PostList, error) {
	return u.postRepo.Search(ctx, tags, q, pq)
}

// GetImagesURLs implements post.UseCase.
func (u *postUC) GetImageURL(ctx context.Context, bucket, key string) (string, error) {
	imageURL, err := u.awsRepo.GetAWSMinioURL(ctx, bucket, key)
	if err != nil {
		return "", err
	}

	fmt.Println(imageURL)

	return fmt.Sprintf("%s/%s/%s", u.cfg.AWS.MinioEndpoint, bucket, key), nil
}

// UploadImage implements post.UseCase.
func (u *postUC) UploadImages(ctx context.Context, postID uuid.UUID, files []models.UploadInput) (*models.Post, error) {
	postByID, err := u.postRepo.GetByID(ctx, postID)
	if err != nil {
		return nil, err
	}

	if err = utils.ValidateIsOwner(ctx, postByID.UserID.String(), u.logger); err != nil {
		return nil, httpErrors.NewRestError(http.StatusForbidden, "Forbidden", errors.Wrap(err, "postUC.Update.ValidateIsOwner"))
	}

	var imageURLs []string
	for _, f := range files {
		uploadInfo, err := u.awsRepo.PutObject(ctx, f)
		if err != nil {
			return nil, httpErrors.NewInternalServerError(errors.Wrap(err, "postUC.UploadImage.PutObject"))
		}

		imageInfo := fmt.Sprintf("%s/%s", f.BucketName, uploadInfo.Key)
		imageURLs = append(imageURLs, imageInfo)
	}

	updatedPost, err := u.postRepo.Update(ctx, &models.Post{
		ID:          postID,
		Description: postByID.Description,
		Location:    postByID.Location,
		ImageURLs:   imageURLs,
	})
	if err != nil {
		return nil, err
	}

	return updatedPost, nil
}

// NewPostUC Post useCase constructor
func NewPostUC(cfg *config.Config, postRepo post.Repository, logger logger.Logger, awsRepo post.AWSRepository) post.UseCase {
	return &postUC{
		cfg:      cfg,
		postRepo: postRepo,
		awsRepo:  awsRepo,
		logger:   logger,
	}
}

// Create Creates new post
func (u *postUC) Create(ctx context.Context, post *models.Post) (*models.Post, error) {
	user, err := utils.GetUserFromCtx(ctx)
	if err != nil {
		return nil, httpErrors.NewUnauthorizedError(errors.WithMessage(err, "postUC.Create.GetUserFromCtx"))
	}

	post.UserID = user.ID

	if err := utils.ValidateStruct(ctx, post); err != nil {
		return nil, httpErrors.NewBadRequestError(errors.WithMessage(err, "postUC.Create.ValidateStruct"))
	}

	p, err := u.postRepo.Create(ctx, post)
	if err != nil {
		return nil, err
	}

	var addedTags []string
	for _, tag := range post.Tags {
		t, err := u.AddTagByTitle(ctx, tag)
		if err != nil {
			return nil, err
		}
		postTag, err := u.CreatePostTag(ctx, p.ID, t.ID)
		if err != nil {
			return nil, err
		}
		fmt.Println(postTag)
		addedTags = append(addedTags, t.Title)
	}
	p.Tags = addedTags

	return p, nil
}

// Update Updates post
func (u *postUC) Update(ctx context.Context, post *models.Post) (*models.Post, error) {
	postByID, err := u.postRepo.GetByID(ctx, post.ID)
	if err != nil {
		return nil, err
	}

	if err = utils.ValidateIsOwner(ctx, postByID.UserID.String(), u.logger); err != nil {
		return nil, httpErrors.NewRestError(http.StatusForbidden, "Forbidden", errors.Wrap(err, "postUC.Update.ValidateIsOwner"))
	}
	post.ImageURLs = postByID.ImageURLs

	updatedPost, err := u.postRepo.Update(ctx, post)
	if err != nil {
		return nil, err
	}

	return updatedPost, nil
	// TODO: add updating tags...
}

// Archive Archives post
func (u *postUC) Archive(ctx context.Context, postID uuid.UUID) error {
	postByID, err := u.postRepo.GetByID(ctx, postID)
	if err != nil {
		return err
	}

	if err = utils.ValidateIsOwner(ctx, postByID.UserID.String(), u.logger); err != nil {
		return httpErrors.NewRestError(http.StatusForbidden, "Forbidden", errors.Wrap(err, "postUC.Archive.ValidateIsOwner"))
	}

	if err := u.postRepo.Archive(ctx, postID); err != nil {
		return err
	}

	return nil
}

// Delete Deletes post
func (u *postUC) Delete(ctx context.Context, postID uuid.UUID) error {
	// postByID, err := u.postRepo.GetByID(ctx, postID)
	// if err != nil {
	// 	return err
	// }
	//
	// if err = utils.ValidateIsOwner(ctx, postByID.UserID.String(), u.logger); err != nil {
	// 	return httpErrors.NewRestError(http.StatusForbidden, "Forbidden", errors.Wrap(err, "postUC.Delete.ValidateIsOwner"))
	// }

	if err := u.postRepo.Delete(ctx, postID); err != nil {
		return err
	}

	return nil
}

// GetPosts Get all posts
func (u *postUC) GetPosts(ctx context.Context, pq *utils.PaginationQuery) (*models.PostList, error) {
	pl, err := u.postRepo.GetPosts(ctx, pq)
	if err != nil {
		return nil, err
	}

	for _, p := range pl.Posts {
		tags, err := u.postRepo.GetTagsOnPost(ctx, p.ID)
		if err != nil {
			return nil, err
		}
		p.Tags = tags
	}

	return pl, err
}

// GetByID Get post by id
func (u *postUC) GetByID(ctx context.Context, postID uuid.UUID) (*models.PostBase, error) {
	// TODO: get from redis and return it

	p, err := u.postRepo.GetByID(ctx, postID)
	if err != nil {
		return nil, err
	}

	tags, err := u.postRepo.GetTagsOnPost(ctx, postID)
	if err != nil {
		return nil, err
	}
	p.Tags = tags

	// TODO: set to redis

	return p, nil
}

// GetByUserID Get posts by user id
func (u *postUC) GetByUserID(ctx context.Context, userID uuid.UUID, pq *utils.PaginationQuery) (*models.PostList, error) {
	pl, err := u.postRepo.GetByUserID(ctx, userID, pq)
	if err != nil {
		return nil, err
	}

	for _, p := range pl.Posts {
		tags, err := u.postRepo.GetTagsOnPost(ctx, p.ID)
		if err != nil {
			return nil, err
		}
		p.Tags = tags
	}

	return pl, err
}

func (u *postUC) AddTagByTitle(ctx context.Context, title string) (*models.Tag, error) {
	t, err := u.postRepo.GetTagByTitle(ctx, title)
	if err != nil {
		return nil, err
	}

	if t == nil {
		newTag, err := u.postRepo.CreateTag(ctx, title)
		if err != nil {
			return nil, err
		}
		return newTag, nil
	}

	return t, nil
}

func (u *postUC) CreatePostTag(ctx context.Context, postID uuid.UUID, tagID uuid.UUID) (*models.PostTag, error) {
	return u.postRepo.CreatePostTag(ctx, postID, tagID)
}

func (u *postUC) GetTagsOnPost(ctx context.Context, postID uuid.UUID) ([]string, error) {
	return u.postRepo.GetTagsOnPost(ctx, postID)
}
