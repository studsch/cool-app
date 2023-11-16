package utils

import (
	"fmt"

	"github.com/studsch/cool-app/backend/pkg/repository"
)

func VerifyGender(gender string) (string, error) {
	switch gender {
	case repository.MaleGenderName:
	case repository.FemaleGenderName:
	default:
		return "", fmt.Errorf("gender '%v' does not exist", gender)
	}

	return gender, nil
}
