package utils

import "golang.org/x/crypto/bcrypt"

func GeneratePassword(p string) string {
	bytePwd := []byte(p)
	hash, err := bcrypt.GenerateFromPassword(bytePwd, bcrypt.DefaultCost)
	if err != nil {
		return err.Error()
	}
	return string(hash)
}

func ComparePasswords(hashedPwd, inputPwd string) bool {
	byteHash := []byte(hashedPwd)
	byteInput := []byte(inputPwd)

	if err := bcrypt.CompareHashAndPassword(byteHash, byteInput); err != nil {
		return false
	}

	return true
}
