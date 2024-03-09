package server

import (
	"github.com/gofiber/fiber/v2"
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
)

// MapHandlers Map server handlers
func (s *Server) MapHandlers(a *fiber.App) error {
	// Init repositories
	authRepo := authRepository.NewAuthRepository(s.db)
	postRepo := postRepository.NewPostRepository(s.db)
	commRepo := commRepository.NewCommentRepository(s.db)
	likeRepo := likeRepository.NewLikeRepository(s.db)
	authAWSRepo := authRepository.NewAuthAWSRepository(s.awsClient)
	postAWSRepo := postRepository.NewPostAWSRepository(s.awsClient)

	// Init useCases
	authUC := authUseCase.NewAuthUC(s.cfg, authRepo, s.logger, authAWSRepo)
	postUC := postUseCase.NewPostUC(s.cfg, postRepo, s.logger, postAWSRepo)
	commUC := commUseCase.NewCommentUC(s.cfg, commRepo, s.logger)
	likeUC := likeUseCase.NewLikeUC(s.cfg, likeRepo, s.logger)

	// Init handlers
	authHandlers := authHttp.NewAuthHandlers(s.cfg, authUC, s.logger)
	postHandlers := postHttp.NewPostHandlers(s.cfg, postUC, s.logger)
	commHandlers := commHttp.NewCommentHandlers(s.cfg, commUC, s.logger)
	likeHandlers := likeHttp.NewLikeHandlers(s.cfg, likeUC, s.logger)

	mw := apiMiddlewares.NewMiddlewareManager(authUC, s.cfg, []string{"*"}, s.logger)

	a.Use(requestid.New())

	a.Use(mw.RequestLoggerMiddleware())

	v1 := a.Group("/api/v1")

	health := v1.Group("/health")
	authGroup := v1.Group("/auth")
	postGroup := v1.Group("/post")
	commGroup := v1.Group("/comment")
	likeGroup := v1.Group("/like")

	authHttp.MapAuthRoutes(authGroup, authHandlers, mw)
	postHttp.MapPostRoutes(postGroup, postHandlers, mw)
	commHttp.MapCommentRoutes(commGroup, commHandlers, mw)
	likeHttp.MapLikeRoutes(likeGroup, likeHandlers, mw)

	health.Get("", func(c *fiber.Ctx) error {
		s.logger.Info("Health check")
		return c.SendStatus(fiber.StatusOK)
	})
	return nil
}
