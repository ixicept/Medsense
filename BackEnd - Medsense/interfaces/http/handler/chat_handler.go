package handler

import (
	"main/domain/chat"

	"github.com/gin-gonic/gin"
)

type ChatHandler struct {
	ChatService chat.ChatService
}

func NewChatHandler(chatService chat.ChatService) *ChatHandler {
	return &ChatHandler{
		ChatService: chatService,
	}
}

func (h *ChatHandler) StartChatSession(ctx *gin.Context) {
	var request struct {
		PatientID string `json:"patient_id" binding:"required"`
		DoctorID  string `json:"doctor_id" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	session, err := h.ChatService.StartChatSession(request.PatientID, request.DoctorID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, session)
}

func (h *ChatHandler) SendMessage(ctx *gin.Context) {
	var request struct {
		SessionID string `json:"session_id" binding:"required"`
		SenderID  string `json:"sender_id" binding:"required"`
		Content   string `json:"content" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	message, err := h.ChatService.SendMessage(request.SessionID, request.SenderID, request.Content)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, message)
}

func (h *ChatHandler) FindChatSessionWithMessages(ctx *gin.Context) {
	var request struct {
		PatientID string `json:"patient_id" binding:"required"`
		DoctorID  string `json:"doctor_id" binding:"required"`
		Offset    int    `json:"offset" binding:"required"`
		Limit     int    `json:"limit" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	sessions, totalCount, err := h.ChatService.FindChatSessionWithMessages(request.PatientID, request.DoctorID, request.Offset, request.Limit)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"sessions": sessions, "total_count": totalCount})
}

func (h *ChatHandler) FindChatSessionByParticipants(ctx *gin.Context) {
	var request struct {
		PatientID string `json:"patient_id" binding:"required"`
		DoctorID  string `json:"doctor_id" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	session, err := h.ChatService.FindChatSessionByParticipants(request.PatientID, request.DoctorID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	if session == nil {
		ctx.JSON(404, gin.H{"message": "No chat session found"})
		return
	}

	ctx.JSON(200, session)
}
