package handler

import (
	"main/application/dto"
	"main/domain/forum"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ForumHandler struct {
	ForumService forum.Service
}

func NewForumHandler(forumService forum.Service) *ForumHandler {
	return &ForumHandler{
		ForumService: forumService,
	}
}

func (h *ForumHandler) CreatePost(ctx *gin.Context) {
	var req dto.CreateForumPostDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err := h.ForumService.SavePost(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Post created successfully"})
}

func (h *ForumHandler) CreateReply(ctx *gin.Context) {
	var req dto.CreateForumReplyDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err := h.ForumService.SaveReply(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create reply"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Reply created successfully"})
}

func (h *ForumHandler) GetAllPosts(ctx *gin.Context) {
	posts, err := h.ForumService.GetAllPosts()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve posts"})
		return
	}

	ctx.JSON(http.StatusOK, posts)
}

func (h *ForumHandler) GetPostByID(ctx *gin.Context) {
	postID := ctx.Param("postID")
	if postID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}

	post, err := h.ForumService.FindPostByID(postID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve post"})
		return
	}

	ctx.JSON(http.StatusOK, post)
}

func (h *ForumHandler) GetRepliesByPostID(ctx *gin.Context) {
	postID := ctx.Param("postID")
	if postID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}

	replies, _, err := h.ForumService.FindRepliesByPostID(postID, 0, 100)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve replies"})
		return
	}

	ctx.JSON(http.StatusOK, replies)
}
