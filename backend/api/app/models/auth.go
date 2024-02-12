package models

type SignUp struct {
	Phone       string `validate:"e164" json:"phone,omitempty" form:"phone"`
	Login       string `validate:"required,lte=30,gte=10" json:"login,omitempty" form:"login"`
	Password    string `validate:"required,lte=20,gte=8" json:"password,omitempty" form:"password"`
	Name        string `validate:"required,lte=80" json:"name,omitempty" form:"name"`
	Surname     string `validate:"required,lte=80" json:"surname,omitempty" form:"surname"`
	DateOfBirth string `validate:"required,DOB" json:"dateOfBirth" form:"dateOfBirth"`
	Gender      string `validate:"required,lte=10,oneof=Male Female" json:"gender,omitempty" form:"gender"`
	UserRole    string `validate:"required,lte=10" json:"userRole,omitempty" form:"userRole"`
	Avatar      string `validate:"avatar" json:"avatar,omitempty" form:"avatar"`
}

type SignInPhone struct {
	Phone    string `validate:"e164" json:"phone"`
	Password string `validate:"required,lte=20,gte=8" json:"password"`
}

type SignInLogin struct {
	Login    string `validate:"required,lte=30,gte=10" json:"login,omitempty"`
	Password string `validate:"required,lte=20,gte=8" json:"password"`
}
