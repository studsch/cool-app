package server

import (
	"time"

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
	msgHttp "github.com/studsch/cool-app/backend/internal/msg/delivery/http"
	msgRepository "github.com/studsch/cool-app/backend/internal/msg/repository"
	msgUseCase "github.com/studsch/cool-app/backend/internal/msg/usecase"
	postHttp "github.com/studsch/cool-app/backend/internal/post/delivery/http"
	postRepository "github.com/studsch/cool-app/backend/internal/post/repository"
	postUseCase "github.com/studsch/cool-app/backend/internal/post/usecase"
	recHttp "github.com/studsch/cool-app/backend/internal/rec/delivery/http"
	recRepository "github.com/studsch/cool-app/backend/internal/rec/repository"
	recUseCase "github.com/studsch/cool-app/backend/internal/rec/usecase"
	userHttp "github.com/studsch/cool-app/backend/internal/user/delivery/http"
	userRepository "github.com/studsch/cool-app/backend/internal/user/repository"
	userUseCase "github.com/studsch/cool-app/backend/internal/user/usecase"
	widgetsHttp "github.com/studsch/cool-app/backend/internal/widgets/deliver/http"
	widgetsRepository "github.com/studsch/cool-app/backend/internal/widgets/repository"
	widgetsUseCase "github.com/studsch/cool-app/backend/internal/widgets/usecase"
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
	authRedisRepo := authRepository.NewAuthRedisRepo(s.redisClient)
	msgRepo := msgRepository.NewPsqlRepo(s.db)
	widgetsRepo := widgetsRepository.NewGrpcRepo(s.widgetsConn, s.logger)
	recRepo := recRepository.NewGrpcRepo(s.recConn)

	// Init useCases
	authUC := authUseCase.NewAuthUC(
		s.cfg, authRepo, s.logger, authAWSRepo, authRedisRepo,
	)
	postUC := postUseCase.NewPostUC(s.cfg, postRepo, s.logger, postAWSRepo, postRedisRepo)
	commUC := commUseCase.NewCommentUC(s.cfg, commRepo, s.logger)
	likeUC := likeUseCase.NewLikeUC(s.cfg, likeRepo, s.logger)
	userUC := userUseCase.NewUserUC(s.cfg, userRepo, s.logger)
	msgUC := msgUseCase.NewChatUC(msgRepo, userRepo)
	widgetsUC := widgetsUseCase.NewWidgetsUC(widgetsRepo, s.logger)
	recUC := recUseCase.NewRecUC(recRepo, s.logger)

	// Init handlers
	authHandlers := authHttp.NewAuthHandlers(s.cfg, authUC, s.logger)
	postHandlers := postHttp.NewPostHandlers(s.cfg, postUC, s.logger)
	commHandlers := commHttp.NewCommentHandlers(s.cfg, commUC, s.logger)
	likeHandlers := likeHttp.NewLikeHandlers(s.cfg, likeUC, s.logger)
	userHandlers := userHttp.NewUserHandlers(s.cfg, userUC, s.logger)
	msgHandlers := msgHttp.NewMsgHandlers(s.cfg, s.logger, msgUC)
	widgetsHandlers := widgetsHttp.NewWidgetsHandlers(widgetsUC, s.logger)
	recHandlers := recHttp.NewRecHandlers(recUC, s.logger)

	// preparing data and models for predict
	// do it every 24 hour
	ticker := time.NewTicker(24 * time.Hour)
	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				s.logger.Info("Updating data and models for predict")
				recUC.PrepareRecs()
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()

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
	msgGroup := v1.Group("/msg")
	widgetsGroup := v1.Group("/widgets")
	recGroup := v1.Group("/recommendations")

	authHttp.MapAuthRoutes(authGroup, authHandlers, mw)
	postHttp.MapPostRoutes(postGroup, postHandlers, mw)
	commHttp.MapCommentRoutes(commGroup, commHandlers, mw)
	likeHttp.MapLikeRoutes(likeGroup, likeHandlers, mw)
	userHttp.MapUserRoutes(userGroup, userHandlers, mw)
	msgHttp.MapMsgRoutes(msgGroup, msgHandlers, mw)
	widgetsHttp.MapWidgetsRoutes(widgetsGroup, widgetsHandlers, mw)
	recHttp.MapRecRoutes(recGroup, recHandlers, mw)

	health.Get("", func(c *fiber.Ctx) error {
		s.logger.Info("Health check")
		return c.SendStatus(fiber.StatusOK)
	})
	return nil
}
