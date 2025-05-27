package forum

import (
	"main/application/dto"
	"time"

	"github.com/google/uuid"
)

type ForumPostStatus string

const (
	StatusDraft     ForumPostStatus = "Active"
	StatusPublished ForumPostStatus = "Published"
	StatusArchived  ForumPostStatus = "Archived"
)

type ForumPost struct {
	ID         string
	Title      string
	Status     ForumPostStatus
	AuthorID   string
	AuthorName string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

type ForumReply struct {
	ID           string
	ForumPostID  string
	AuthorID     string
	AuthorName   string
	ReplyMessage string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func NewForumPost(req dto.CreateForumPostDTO) (*ForumPost, error) {

	return &ForumPost{
		ID:         uuid.NewString(),
		Title:      req.Title,
		Status:     ForumPostStatus(req.Status),
		AuthorID:   req.AuthorID,
		AuthorName: req.AuthorName,
		CreatedAt:  time.Now().UTC(),
		UpdatedAt:  time.Now().UTC(),
	}, nil
}

func NewForumReply(req dto.CreateForumReplyDTO) (*ForumReply, error) {
	return &ForumReply{
		ID:           uuid.NewString(),
		ForumPostID:  req.ForumPostID,
		AuthorID:     req.AuthorID,
		AuthorName:   req.AuthorName,
		ReplyMessage: req.ReplyMessage,
		CreatedAt:    time.Now().UTC(),
		UpdatedAt:    time.Now().UTC(),
	}, nil
}
