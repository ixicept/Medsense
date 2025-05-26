package repository

import (
	"main/domain/chat"

	"gorm.io/gorm"
)

type ChatRepository struct {
	db *gorm.DB
}

func NewChatRepository(db *gorm.DB) chat.ChatSessionRepository {
	return &ChatRepository{db: db}
}

func (r *ChatRepository) Save(session *chat.ChatSession) error {
	if err := r.db.Create(session).Error; err != nil {
		return err
	}
	return nil
}

func (r *ChatRepository) FindByID(id string) (*chat.ChatSession, error) {
	var session chat.ChatSession
	if err := r.db.First(&session, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *ChatRepository) FindByParticipantID(participantID string, offset int, limit int) ([]*chat.ChatSession, int, error) {
	var sessions []*chat.ChatSession
	var totalCount int64

	if err := r.db.Model(&chat.ChatSession{}).Where("participant_id = ?", participantID).Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Where("participant_id = ?", participantID).Offset(offset).Limit(limit).Find(&sessions).Error; err != nil {
		return nil, 0, err
	}

	return sessions, int(totalCount), nil
}

func (r *ChatRepository) FindByParticipants(patientID string, doctorID string) (*chat.ChatSession, error) {
	var session chat.ChatSession
	if err := r.db.Where("patient_id = ? AND doctor_id = ?", patientID, doctorID).First(&session).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

