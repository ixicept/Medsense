package handler

import (
	"main/domain/auth"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	AuthService auth.Service
}

func NewAuthHandler(authService auth.Service) *AuthHandler {
	return &AuthHandler{
		AuthService: authService,
	}
}

func (h *AuthHandler) CreateAccount(ctx *gin.Context) {
	var request struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=8"`
		Role     string `json:"role" binding:"required,oneof=admin doctor patient"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	accountID, err := h.AuthService.CreateAccount(request.Email, request.Password, request.Role)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create account"})
		return
	}

	ctx.JSON(201, gin.H{"account_id": accountID})
}
