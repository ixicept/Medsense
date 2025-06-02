package main

import (
	"fmt"
	"main/application"
	"main/domain/appointment"
	"main/domain/auth"
	doctorschedule "main/domain/doctor_schedule"
	"main/domain/forum"
	"main/domain/hospital"
	"main/infrastructure"
	interfaces "main/interfaces/http"
	"main/interfaces/http/handler"
	"main/interfaces/repository"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/go-playground/validator/v10"
)

func main() {

	db := infrastructure.ConnectionDatabase()
	// database.InitRedis()

	db.AutoMigrate(
		&auth.Account{},
		&auth.DoctorRegistration{},
		&forum.ForumPost{},
		&forum.ForumReply{},
		&appointment.AppointmentRequest{},
		&hospital.Hospital{},
		&doctorschedule.Schedule{},
	)

	validator := validator.New()
	// secretKey := "your_secret_key"

	authRepo := repository.NewAuthRepository(db)
	regisRepo := repository.NewDoctorRegistrationRepository(db)
	forumRepo := repository.NewForumRepository(db)
	appointmentRepo := repository.NewAppointmentRepository(db)
	hospitalRepo := repository.NewHospitalRepository(db)
	scheduleRepo := repository.NewScheduleRepository(db)

	authService := application.NewAuthService(authRepo, regisRepo)
	forumService := application.NewForumService(forumRepo, validator)
	appointmentService := application.NewAppointmentService(appointmentRepo, validator)
	hospitalService := application.NewHospitalService(hospitalRepo, validator)
	scheduleService := application.NewScheduleService(scheduleRepo, validator)
	// authService := services.NewAuthService(secretKey)
	// albumService := services.NewAlbumService(albumRepo, trackRepo, validator)
	// artistService := services.NewArtistService(artistRepo, userRepo, validator)
	// verificationService := services.NewVerificationRequestService(verification, validator, userRepo, artistService)
	// trackService := services.NewTrackService(albumRepo, trackRepo, validator)

	authHandler := handler.NewAuthHandler(authService)
	forumHandler := handler.NewForumHandler(forumService)
	appointmentHandler := handler.NewAppointmentHandler(appointmentService, authService)
	hospitalHandler := handler.NewHospitalHandler(hospitalService)
	scheduleHandler := handler.NewScheduleHandler(scheduleService)

	// albumController := controllers.NewAlbumController(albumService)
	// artistController := controllers.NewArtistController(artistService)
	// verificationController := controllers.NewVerificationRequestController(verificationService)
	// trackController := controllers.NewTrackController(trackService)

	r := interfaces.NewRouter(db, *authHandler, *forumHandler, *appointmentHandler, *hospitalHandler, *scheduleHandler)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:8080", "http://localhost:6379"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	server := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	err := server.ListenAndServe()
	if err != nil {
		panic("Failed to start server: " + err.Error())
	}

	sqlDB, err := db.DB()
	if err != nil {
		panic("Failed to get generic database object: " + err.Error())
	}

	// Ping the database to verify the connection
	err = sqlDB.Ping()
	if err != nil {
		panic("Failed to connect to the database: " + err.Error())
	}

	fmt.Println("Successfully connected to the database!")

	r.Run()
}
