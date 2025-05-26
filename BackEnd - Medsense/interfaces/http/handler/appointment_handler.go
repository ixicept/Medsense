package handler

import (
	"main/domain/appointment"

	"github.com/gin-gonic/gin"
)

type AppointmentHandler struct {
	AppointmentService appointment.Service
}

func NewAppointmentHandler(service appointment.Service) *AppointmentHandler {
	return &AppointmentHandler{
		AppointmentService: service,
	}
}

func (h *AppointmentHandler) RequestAppointment(ctx *gin.Context) {
	var req appointment.AppointmentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.AppointmentService.RequestAppointment(&req); err != nil {
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
	patientID := ctx.Param("patient_id")
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
	doctorID := ctx.Param("doctor_id")
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

func (h *AppointmentHandler) ApproveAppointment(ctx *gin.Context) {
	var req appointment.AppointmentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.AppointmentService.ApproveAppointment(&req); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Appointment approved successfully"})
}

func (h *AppointmentHandler) RejectAppointment(ctx *gin.Context) {
	var req appointment.AppointmentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.AppointmentService.RejectAppointment(&req); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Appointment rejected successfully"})
}

func (h *AppointmentHandler) CompleteAppointment(ctx *gin.Context) {
	var req appointment.AppointmentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.AppointmentService.CompleteAppointment(&req); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Appointment completed successfully"})
}
