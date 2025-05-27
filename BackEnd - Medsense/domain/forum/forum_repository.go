package forum

type ForumRepository interface {
	SavePost(req *ForumPost) error
	FindPostByID(id string) (*ForumPost, error)
	FindPostsByAuthorID(authorID string, statusFilter []ForumPostStatus, offset int, limit int) (posts []*ForumPost, totalCount int, err error)
	FindPostsByStatus(status ForumPostStatus, offset int, limit int) (posts []*ForumPost, totalCount int, err error)
	SaveReply(req *ForumReply) error
	FindRepliesByPostID(postID string, offset int, limit int) (replies []*ForumReply, totalCount int, err error)
	FindReplyByID(id string) (*ForumReply, error)
	FindRepliesByAuthorID(authorID string, offset int, limit int) (replies []*ForumReply, totalCount int, err error)
	GetAllPosts() (posts []*ForumPost, err error)
}
