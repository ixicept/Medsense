package dto

type CreateForumPostDTO struct {
	Title      string `json:"forum_title"`
	AuthorID   string `json:"user_id"`
	AuthorName string `json:"user_name"`
	Status     string `json:"status"`
}
