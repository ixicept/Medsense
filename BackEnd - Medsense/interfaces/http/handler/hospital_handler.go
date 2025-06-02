package handler

import (
	"main/application/dto"
	"main/domain/hospital"

	"github.com/gin-gonic/gin"
)

type HospitalHandler struct {
	service hospital.Service
}

func NewHospitalHandler(service hospital.Service) *HospitalHandler {
	return &HospitalHandler{
		service: service,
	}
}

func (h *HospitalHandler) Save(ctx *gin.Context) {
	var req dto.CreateHospitalDTO
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.service.Save(req); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, gin.H{"message": "Hospital created successfully"})
}

func (h *HospitalHandler) FindByID(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(400, gin.H{"error": "Hospital ID is required"})
		return
	}

	hospitalEntity, err := h.service.FindByID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	if hospitalEntity == nil {
		ctx.JSON(404, gin.H{"error": "Hospital not found"})
		return
	}
	ctx.JSON(200, gin.H{"hospital": hospitalEntity})
}

func (h *HospitalHandler) GetAllHospitals(ctx *gin.Context) {
	hospitals, _, err := h.service.GetAllHospitals(0, 100)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"hospitals": hospitals})
}

func (h *HospitalHandler) DeleteByID(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(400, gin.H{"error": "Hospital ID is required"})
		return
	}

	if err := h.service.DeleteByID(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Hospital deleted successfully"})
}
