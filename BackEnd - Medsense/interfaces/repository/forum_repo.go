package repository

import (
	"main/domain/forum"

	"gorm.io/gorm"
)

type ForumRepository struct {
	db *gorm.DB
}

func NewForumRepository(db *gorm.DB) forum.ForumRepository {
	return &ForumRepository{db: db}
}

func (r *ForumRepository) SavePost(post *forum.ForumPost) error {
	var existingPost forum.ForumPost

	if err := r.db.Where("id = ?", post.ID).First(&existingPost).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			if err := r.db.Create(post).Error; err != nil {
				return err
			}
		} else {
			return err
		}
	} else {
		if err := r.db.Save(post).Error; err != nil {
			return err
		}
	}
	return nil
}

func (r *ForumRepository) FindPostByID(id string) (*forum.ForumPost, error) {
	var post forum.ForumPost
	if err := r.db.First(&post, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *ForumRepository) FindPostsByAuthorID(authorID string, statusFilter []forum.ForumPostStatus, offset int, limit int) ([]*forum.ForumPost, int, error) {
	var posts []*forum.ForumPost
	var totalCount int64

	query := r.db.Model(&forum.ForumPost{}).Where("author_id = ?", authorID)

	if len(statusFilter) > 0 {
		query = query.Where("status IN ?", statusFilter)
	}

	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Offset(offset).Limit(limit).Find(&posts).Error; err != nil {
		return nil, 0, err
	}

	return posts, int(totalCount), nil
}

func (r *ForumRepository) FindPostsByStatus(status forum.ForumPostStatus, offset int, limit int) ([]*forum.ForumPost, int, error) {
	var posts []*forum.ForumPost
	var totalCount int64

	query := r.db.Model(&forum.ForumPost{}).Where("status = ?", status)

	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Offset(offset).Limit(limit).Find(&posts).Error; err != nil {
		return nil, 0, err
	}

	return posts, int(totalCount), nil
}

func (r *ForumRepository) SaveReply(reply *forum.ForumReply) error {
	var existingReply forum.ForumReply

	if err := r.db.Where("id = ?", reply.ID).First(&existingReply).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			if err := r.db.Create(reply).Error; err != nil {
				return err
			}
		}
	} else {
		reply.AuthorName = existingReply.AuthorName
		reply.ReplyMessage = existingReply.ReplyMessage
		reply.UpdatedAt = existingReply.UpdatedAt
		if err := r.db.Save(reply).Error; err != nil {
			return err
		}
	}
	return nil
}

func (r *ForumRepository) FindRepliesByPostID(postID string, offset int, limit int) ([]*forum.ForumReply, int, error) {
	var replies []*forum.ForumReply
	var totalCount int64

	query := r.db.Model(&forum.ForumReply{}).Where("forum_post_id = ?", postID)

	if err := query.Where("forum_post_id = ?", postID).Count(&totalCount).Error; err != nil {
		return nil, 0, nil
	}

	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}
	if err := query.Offset(offset).Limit(limit).Find(&replies).Error; err != nil {
		return nil, 0, err
	}
	return replies, int(totalCount), nil
}

func (r *ForumRepository) FindReplyByID(id string) (*forum.ForumReply, error) {
	var reply forum.ForumReply
	if err := r.db.First(&reply, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &reply, nil
}

func (r *ForumRepository) FindRepliesByAuthorID(authorID string, offset int, limit int) ([]*forum.ForumReply, int, error) {
	var replies []*forum.ForumReply
	var totalCount int64

	query := r.db.Model(&forum.ForumReply{}).Where("author_id = ?", authorID)

	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}
	if err := query.Offset(offset).Limit(limit).Find(&replies).Error; err != nil {
		return nil, 0, err
	}
	return replies, int(totalCount), nil
}

func (r *ForumRepository) GetAllPosts() ([]*forum.ForumPost, error) {
	var posts []*forum.ForumPost
	if err := r.db.Find(&posts).Error; err != nil {
		return nil, err
	}
	return posts, nil
}
