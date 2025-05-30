package interfaces

import (
	"main/interfaces/http/handler"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewRouter(db *gorm.DB, authHandler handler.AuthHandler, forumHandler handler.ForumHandler, appointmentHandler handler.AppointmentHandler) *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	api := router.Group("/api")
	{
		api.POST("auth/register-patient", authHandler.CreateAccount)
		api.POST("auth/login", authHandler.Login)
		api.POST("auth/register-doctor", authHandler.CreateRegistration)
		api.GET("auth/roles/:role", authHandler.FindByRole)
		api.POST("forum/post", forumHandler.CreatePost)
		api.POST("forum/reply", forumHandler.CreateReply)
		api.GET("forum/posts", forumHandler.GetAllPosts)
		api.GET("forum/posts/:postID", forumHandler.GetPostByID)
		api.GET("forum/posts/:postID/replies", forumHandler.GetRepliesByPostID)
		api.POST("appointment/request",appointmentHandler.RequestAppointment)
		// protected := router.Group("/api")
		// // protected.Use(authMiddleware(db))
		// {

		// }
	}

	return router
}
