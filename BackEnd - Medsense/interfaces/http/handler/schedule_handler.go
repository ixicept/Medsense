package handler

import (
	"main/application/dto"
	doctorschedule "main/domain/doctor_schedule"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ScheduleHandler struct {
	ScheduleService doctorschedule.Service
}

func NewScheduleHandler(scheduleService doctorschedule.Service) *ScheduleHandler {
	return &ScheduleHandler{
		ScheduleService: scheduleService,
	}
}

func (h *ScheduleHandler) Save(ctx *gin.Context) {
	var req dto.CreateScheduleDTO
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.ScheduleService.Save(req); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Schedule saved successfully"})
}

func (h *ScheduleHandler) FindByID(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Schedule ID is required"})
		return
	}

	schedule, err := h.ScheduleService.FindByID(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if schedule == nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Schedule not found"})
		return
	}
	ctx.JSON(http.StatusOK, schedule)
}

func mapScheduleToResponse(s *doctorschedule.Schedule) *doctorschedule.Schedule {
    return &doctorschedule.Schedule{
        DoctorID:      s.DoctorID,
        HospitalID:    s.HospitalID,
        Day:           s.Day,
        ScheduleStart: s.ScheduleStart.UTC(),
        ScheduleEnd:   s.ScheduleEnd.UTC(),
    }
}

func (h *ScheduleHandler) FindByDoctorID(ctx *gin.Context) {
    doctorID := ctx.Param("doctorID")
    if doctorID == "" {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Doctor ID is required"})
        return
    }

    schedules, err := h.ScheduleService.FindByDoctorID(doctorID)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    var responses []*doctorschedule.Schedule
    for _, s := range schedules {
        responses = append(responses, mapScheduleToResponse(s))
    }

    ctx.JSON(http.StatusOK, responses)
}


func (h *ScheduleHandler) DeleteByID(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Schedule ID is required"})
		return
	}

	if err := h.ScheduleService.DeleteByID(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Schedule deleted successfully"})
}
