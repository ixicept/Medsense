package dto

type CreateForumReplyDTO struct {
	ForumPostID  string `json:"forum_post_id"`
	AuthorID     string `json:"user_id"`
	AuthorName   string `json:"user_name"`
	ReplyMessage string `json:"reply_message"`
}
