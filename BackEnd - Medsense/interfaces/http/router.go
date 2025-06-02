package interfaces

import (
	"main/interfaces/http/handler"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewRouter(db *gorm.DB, authHandler handler.AuthHandler, forumHandler handler.ForumHandler, appointmentHandler handler.AppointmentHandler, hospitalHandler handler.HospitalHandler, scheduleHandler handler.ScheduleHandler) *gin.Engine {
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
		api.POST("doctor-registration/approve", authHandler.ApproveRegistration)
		api.POST("doctor-registration/decline", authHandler.DeclineRegistration)
		api.GET("doctor-registration", authHandler.FindPending)
		api.GET("doctor/:doctorID", authHandler.FindByDoctorID)

		api.POST("forum/post", forumHandler.CreatePost)
		api.POST("forum/reply", forumHandler.CreateReply)
		api.GET("forum/posts", forumHandler.GetAllPosts)
		api.GET("forum/posts/:postID", forumHandler.GetPostByID)
		api.GET("forum/posts/:postID/replies", forumHandler.GetRepliesByPostID)

		api.POST("appointment/request", appointmentHandler.RequestAppointment)
		api.POST("appointment/approve", appointmentHandler.ApproveAppointment)
		api.POST("appointment/decline", appointmentHandler.RejectAppointment)
		api.POST("appointment/complete", appointmentHandler.CompleteAppointment)
		api.GET("appointment/patient/:patientID", appointmentHandler.FindAppointmentRequestsByPatientID)
		api.GET("appointment/today/patient/:patientID", appointmentHandler.FindPatientAppointmentsToday)
		api.GET("appointment/doctor/:doctorID", appointmentHandler.FindAppointmentRequestsByDoctorID)
		api.GET("appointment/today/doctor/:doctorID", appointmentHandler.FindDoctorAppointmentsToday)

		api.GET("hospital", hospitalHandler.GetAllHospitals)
		api.POST("hospital", hospitalHandler.Save)
		api.GET("hospital/:id", hospitalHandler.FindByID)
		api.DELETE("hospital/:id", hospitalHandler.DeleteByID)

		api.POST("schedule", scheduleHandler.Save)
		api.GET("schedule/:id", scheduleHandler.FindByID)
		api.GET("schedule/:doctorID", scheduleHandler.FindByDoctorID)
		api.DELETE("schedule/:id", scheduleHandler.DeleteByID)

		// protected := router.Group("/api")
		// // protected.Use(authMiddleware(db))
		// {

		// }
	}

	return router
}
