package models

type SignUp struct {
	Phone       string `validate:"e164" json:"phone,omitempty"`
	Password    string `validate:"required,lte=20,gte=8" json:"password,omitempty"`
	Name        string `validate:"required,lte=80" json:"name,omitempty"`
	Surname     string `validate:"required,lte=80" json:"surname,omitempty"`
	DateOfBirth string `validate:"required,DOB" json:"date_of_birth"`
	Gender      string `validate:"required,lte=10,oneof=Male Female" json:"gender,omitempty"`
	UserRole    string `validate:"required,lte=10" json:"user_role,omitempty"`
}
