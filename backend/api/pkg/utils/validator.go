package utils

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"time"
)

func NewValidator() *validator.Validate {
	validate := validator.New()

	_ = validate.RegisterValidation("uuid", func(fl validator.FieldLevel) bool {
		field := fl.Field().String()
		if _, err := uuid.Parse(field); err != nil {
			return true
		}
		return false
	})

	_ = validate.RegisterValidation("DOB", isDOB)

	return validate
}

func isDOB(fl validator.FieldLevel) bool {
	field := fl.Field().String()
	if _, err := time.Parse("02-01-2006", field); err != nil {
		return false
	}
	return true
}

func ValidatorErrors(err error) map[string]string {
	fields := map[string]string{}

	for _, err := range err.(validator.ValidationErrors) {
		fields[err.Field()] = err.Error()
	}

	return fields
}
