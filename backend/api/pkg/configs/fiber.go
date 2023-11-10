package configs

import (
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Fiber() fiber.Config {
	readTimeoutSeconsCount, _ := strconv.Atoi(os.Getenv("SERVER_READ_TIMEOUT"))

	return fiber.Config{
		ReadTimeout: time.Second * time.Duration(readTimeoutSeconsCount),
	}
}
