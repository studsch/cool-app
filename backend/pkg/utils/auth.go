package utils

import (
	"context"
	"github.com/studsch/cool-app/backend/pkg/httpErrors"
	"github.com/studsch/cool-app/backend/pkg/logger"
)

// ValidateIsOwner Validate is user from owner of content
func ValidateIsOwner(ctx context.Context, creatorID string, logger logger.Logger) error {
	user, err := GetUserFromCtx(ctx)
	if err != nil {
		return err
	}

	if user.ID.String() != creatorID {
		logger.Errorf(
			"ValidateIsOwner, userID: %v, creatorID: %v",
			user.ID.String(),
			creatorID,
		)
		return httpErrors.Forbidden
	}

	return nil
}
