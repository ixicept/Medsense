package application

import (
	"main/application/dto"
	"main/domain/forum"

	"github.com/go-playground/validator/v10"
)

type ForumService struct {
	ForumRepository forum.ForumRepository
	validate        *validator.Validate
}

func NewForumService(forumRepo forum.ForumRepository, validate *validator.Validate) forum.Service {
	return &ForumService{
		ForumRepository: forumRepo,
		validate:        validate,
	}
}

func (s *ForumService) SavePost(req dto.CreateForumPostDTO) (*forum.ForumPost, error) {
	if err := s.validate.Struct(req); err != nil {
		return nil, err
	}

	post, err := forum.NewForumPost(req)
	if err != nil {
		return nil, err
	}

	s.ForumRepository.SavePost(post)

	return post, nil
}

func (s *ForumService) FindPostByID(id string) (*forum.ForumPost, error) {
	post, err := s.ForumRepository.FindPostByID(id)
	if err != nil {
		return nil, err
	}
	return post, nil
}

func (s *ForumService) FindPostsByAuthorID(authorID string, statusFilter []forum.ForumPostStatus, offset int, limit int) ([]*forum.ForumPost, int, error) {
	posts, totalCount, err := s.ForumRepository.FindPostsByAuthorID(authorID, statusFilter, offset, limit)
	if err != nil {
		return nil, 0, err
	}
	return posts, totalCount, nil
}

func (s *ForumService) FindPostsByStatus(status forum.ForumPostStatus, offset int, limit int) ([]*forum.ForumPost, int, error) {
	posts, totalCount, err := s.ForumRepository.FindPostsByStatus(status, offset, limit)
	if err != nil {
		return nil, 0, err
	}
	return posts, totalCount, nil
}

func (s *ForumService) SaveReply(req dto.CreateForumReplyDTO) (*forum.ForumReply, error) {
	if err := s.validate.Struct(req); err != nil {
		return nil, err
	}

	reply, err := forum.NewForumReply(req)
	if err != nil {
		return nil, err
	}

	s.ForumRepository.SaveReply(reply)

	return reply, nil
}

func (s *ForumService) FindRepliesByPostID(postID string, offset int, limit int) ([]*forum.ForumReply, int, error) {
	replies, totalCount, err := s.ForumRepository.FindRepliesByPostID(postID, offset, limit)
	if err != nil {
		return nil, 0, err
	}
	return replies, totalCount, nil
}

func (s *ForumService) FindReplyByID(id string) (*forum.ForumReply, error) {
	reply, err := s.ForumRepository.FindReplyByID(id)
	if err != nil {
		return nil, err
	}
	return reply, nil
}

func (s *ForumService) FindRepliesByAuthorID(authorID string, offset int, limit int) ([]*forum.ForumReply, int, error) {
	replies, totalCount, err := s.ForumRepository.FindRepliesByAuthorID(authorID, offset, limit)
	if err != nil {
		return nil, 0, err
	}
	return replies, totalCount, nil
}

func (s *ForumService) GetAllPosts() ([]*forum.ForumPost, error) {
	posts, err := s.ForumRepository.GetAllPosts()
	if err != nil {
		return nil, err
	}
	return posts, nil
}
