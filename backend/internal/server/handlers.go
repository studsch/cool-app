package server

import (
	"github.com/gofiber/contrib/swagger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	authHttp "github.com/studsch/cool-app/backend/internal/auth/delivery/http"
	authRepository "github.com/studsch/cool-app/backend/internal/auth/repository"
	authUseCase "github.com/studsch/cool-app/backend/internal/auth/usecase"
	commHttp "github.com/studsch/cool-app/backend/internal/comment/delivery/http"
	commRepository "github.com/studsch/cool-app/backend/internal/comment/repository"
	commUseCase "github.com/studsch/cool-app/backend/internal/comment/usecase"
	likeHttp "github.com/studsch/cool-app/backend/internal/like/delivery/http"
	likeRepository "github.com/studsch/cool-app/backend/internal/like/repository"
	likeUseCase "github.com/studsch/cool-app/backend/internal/like/usecase"
	apiMiddlewares "github.com/studsch/cool-app/backend/internal/middleware"
	postHttp "github.com/studsch/cool-app/backend/internal/post/delivery/http"
	postRepository "github.com/studsch/cool-app/backend/internal/post/repository"
	postUseCase "github.com/studsch/cool-app/backend/internal/post/usecase"
	userHttp "github.com/studsch/cool-app/backend/internal/user/delivery/http"
	userRepository "github.com/studsch/cool-app/backend/internal/user/repository"
	userUseCase "github.com/studsch/cool-app/backend/internal/user/usecase"
)

// MapHandlers Map server handlers
func (s *Server) MapHandlers(a *fiber.App) error {
	// Init repositories
	authRepo := authRepository.NewAuthRepository(s.db)
	postRepo := postRepository.NewPostRepository(s.db)
	commRepo := commRepository.NewCommentRepository(s.db)
	likeRepo := likeRepository.NewLikeRepository(s.db)
	userRepo := userRepository.NewUserRepository(s.db)
	authAWSRepo := authRepository.NewAuthAWSRepository(s.awsClient)
	postAWSRepo := postRepository.NewPostAWSRepository(s.awsClient)
	postRedisRepo := postRepository.NewPostRedisRepo(s.redisClient)

	// Init useCases
	authUC := authUseCase.NewAuthUC(s.cfg, authRepo, s.logger, authAWSRepo)
	postUC := postUseCase.NewPostUC(s.cfg, postRepo, s.logger, postAWSRepo, postRedisRepo)
	commUC := commUseCase.NewCommentUC(s.cfg, commRepo, s.logger)
	likeUC := likeUseCase.NewLikeUC(s.cfg, likeRepo, s.logger)
	userUC := userUseCase.NewUserUC(s.cfg, userRepo, s.logger)

	// Init handlers
	authHandlers := authHttp.NewAuthHandlers(s.cfg, authUC, s.logger)
	postHandlers := postHttp.NewPostHandlers(s.cfg, postUC, s.logger)
	commHandlers := commHttp.NewCommentHandlers(s.cfg, commUC, s.logger)
	likeHandlers := likeHttp.NewLikeHandlers(s.cfg, likeUC, s.logger)
	userHandlers := userHttp.NewUserHandlers(s.cfg, userUC, s.logger)

	mw := apiMiddlewares.NewMiddlewareManager(authUC, s.cfg, []string{"*"}, s.logger)

	a.Use(requestid.New())

	a.Use(mw.RequestLoggerMiddleware())

	a.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, https://localhost:8000",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	a.Use(swagger.New(swagger.Config{
		BasePath: "/",
		FilePath: "./docs/swagger.yaml",
		Path:     "swagger",
		Title:    "Swagger API Docs",
	}))

	v1 := a.Group("/api/v1")

	health := v1.Group("/health")
	authGroup := v1.Group("/auth")
	postGroup := v1.Group("/post")
	commGroup := v1.Group("/comment")
	likeGroup := v1.Group("/like")
	userGroup := v1.Group("/user")

	authHttp.MapAuthRoutes(authGroup, authHandlers, mw)
	postHttp.MapPostRoutes(postGroup, postHandlers, mw)
	commHttp.MapCommentRoutes(commGroup, commHandlers, mw)
	likeHttp.MapLikeRoutes(likeGroup, likeHandlers, mw)
	userHttp.MapUserRoutes(userGroup, userHandlers, mw)

	health.Get("", func(c *fiber.Ctx) error {
		s.logger.Info("Health check")
		return c.SendStatus(fiber.StatusOK)
	})
	return nil
}
