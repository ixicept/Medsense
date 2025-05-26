package handler

import (
	"fmt"
	"main/application/dto"
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

	var req dto.CreateUserDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	accountID, err := h.AuthService.CreateAccount(req)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create account"})
		return
	}

	ctx.JSON(201, gin.H{"account_id": accountID})
}

func (h *AuthHandler) Login(ctx *gin.Context) {
	var request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}
	
	fmt.Println(request)


	account, err := h.AuthService.Login(request.Email, request.Password)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Login failed"})
		return
	}

	ctx.JSON(200, account)
}
