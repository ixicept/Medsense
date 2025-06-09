package handler

import (
	"main/application/dto"
	"main/domain/appointment"
	"main/domain/auth"

	"github.com/gin-gonic/gin"
)

type AppointmentHandler struct {
	AppointmentService appointment.Service
	AuthHandler        auth.Service
}

func NewAppointmentHandler(service appointment.Service, AuthHandler auth.Service) *AppointmentHandler {
	return &AppointmentHandler{
		AppointmentService: service,
		AuthHandler:        AuthHandler,
	}
}

func (h *AppointmentHandler) RequestAppointment(ctx *gin.Context) {
	var req dto.CreateAppointmentDTO
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	account, err := h.AuthHandler.FindByEmail(req.PatientID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to find patient account"})
		return
	}

	req.PatientID = account.ID

	if err := h.AppointmentService.RequestAppointment(req); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, gin.H{"message": "Appointment requested successfully"})
}

func (h *AppointmentHandler) FindAppointmentRequestByID(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(400, gin.H{"error": "Appointment ID is required"})
		return
	}

	req, err := h.AppointmentService.FindAppointmentRequestByID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	if req == nil {
		ctx.JSON(404, gin.H{"error": "Appointment not found"})
		return
	}

	ctx.JSON(200, req)
}

func (h *AppointmentHandler) FindAppointmentRequestsByPatientID(ctx *gin.Context) {
	patientID := ctx.Param("patientID")
	if patientID == "" {
		ctx.JSON(400, gin.H{"error": "Patient ID is required"})
		return
	}

	statusFilter := []appointment.AppointmentStatus{appointment.StatusPending, appointment.StatusApproved}
	offset := 0
	limit := 10

	requests, totalCount, err := h.AppointmentService.FindAppointmentRequestsByPatientID(patientID, statusFilter, offset, limit)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"requests": requests, "total_count": totalCount})
}

func (h *AppointmentHandler) FindAppointmentRequestsByDoctorID(ctx *gin.Context) {
	doctorID := ctx.Param("doctorID")
	if doctorID == "" {
		ctx.JSON(400, gin.H{"error": "Doctor ID is required"})
		return
	}

	statusFilter := []appointment.AppointmentStatus{appointment.StatusPending, appointment.StatusApproved}
	offset := 0
	limit := 10

	requests, totalCount, err := h.AppointmentService.FindAppointmentRequestsByDoctorID(doctorID, statusFilter, offset, limit)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"requests": requests, "total_count": totalCount})
}
type ApproveAppointmentRequest struct {
	AppointmentID string `json:"appointment_id" binding:"required"`
}	
func (h *AppointmentHandler) ApproveAppointment(ctx *gin.Context) {
	var req ApproveAppointmentRequest
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(400, gin.H{"error": err.Error()})
        return
    }
	if err := h.AppointmentService.ApproveAppointment(req.AppointmentID); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"message": "Appointment approved successfully"})
}

func (h *AppointmentHandler) RejectAppointment(ctx *gin.Context) {
	var req ApproveAppointmentRequest
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(400, gin.H{"error": err.Error()})
        return
    }
	if err := h.AppointmentService.RejectAppointment(req.AppointmentID); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"message": "Appointment rejected successfully"})
}

func (h *AppointmentHandler) CompleteAppointment(ctx *gin.Context) {
	req := ctx.Param("apppointment_id")
	if req == "" {
		ctx.JSON(400, gin.H{"error": "Appointment ID is required"})
		return
	}
	if err := h.AppointmentService.CompleteAppointment(req); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"message": "Appointment completed successfully"})

}

func (h *AppointmentHandler) FindDoctorAppointmentsToday(ctx *gin.Context) {
	doctorID := ctx.Param("doctorID")
	if doctorID == "" {
		ctx.JSON(400, gin.H{"error": "Doctor ID is required"})
		return
	}

	appointments, err := h.AppointmentService.FindDoctorAppointmentsToday(doctorID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, appointments)
}

func (h *AppointmentHandler) FindPatientAppointmentsToday(ctx *gin.Context) {
	patientID := ctx.Param("patientID")
	if patientID == "" {
		ctx.JSON(400, gin.H{"error": "Patient ID is required"})
		return
	}

	appointments, err := h.AppointmentService.FindPatientAppointmentsToday(patientID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, appointments)
}
