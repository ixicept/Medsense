package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"main/application/dto"
	"main/domain/auth"
	"net/http"

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

	account, err := h.AuthService.CreateAccount(req)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create account"})
		return
	}

	ctx.JSON(200, gin.H{"account": account})
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

func (h *AuthHandler) CreateRegistration(ctx *gin.Context) {

	if err := ctx.Request.ParseMultipartForm(32 << 20); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to parse multipart form", "detail": err.Error()})
		return
	}

	regisForm := ctx.PostForm("RegisForm")

	var req dto.CreateRegistrationDTO
	if err := json.Unmarshal([]byte(regisForm), &req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CaseHeader JSON", "detail": err.Error()})
		return
	}

	var fileBytes []byte
	file, err := ctx.FormFile("file_attachment")
	if err == nil {
		openedFile, err := file.Open()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file", "detail": err.Error()})
			return
		}
		defer openedFile.Close()

		fileBytes, err = io.ReadAll(openedFile)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read uploaded file", "detail": err.Error()})
			return
		}
	} else {
		fileBytes = nil
	}

	req.FileAttachment = fileBytes

	err = h.AuthService.SubmitDocterRegistration(req)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create registration"})
		return
	}

	ctx.JSON(200, gin.H{"message": "Registration created successfully"})
}
