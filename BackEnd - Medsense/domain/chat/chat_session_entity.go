package chat

import (
	"errors"
	"time"

	"github.com/google/uuid"
)


type Message struct {
	ID        string       
	SenderID  string
	Content   string
	SentAt    time.Time
	// ReadAt    *time.Time // Optional: if tracking read receipts
	// MessageType string     // Optional: "text", "image", "file"
}

type ChatSession struct {
	ID           string
	PatientID    string 
	DoctorID     string
	Messages     []Message  
	CreatedAt    time.Time
	LastActivity time.Time 
}

func NewChatSession(patientID string, doctorID string) (*ChatSession, error) {
	if patientID == "" {
		return nil, errors.New("patient ID cannot be empty for new chat session")
	}
	if doctorID == "" {
		return nil, errors.New("doctor ID cannot be empty for new chat session")
	}
	if patientID == doctorID {
		return nil, errors.New("patient and doctor IDs cannot be the same for a chat session")
	}

	now := time.Now().UTC()
	return &ChatSession{
		ID:           uuid.NewString(),
		PatientID:    patientID,
		DoctorID:     doctorID,
		Messages:     []Message{}, 
		CreatedAt:    now,
		LastActivity: now,
	}, nil
}


func (cs *ChatSession) AddMessage(senderID string, content string) (*Message, error) {
	if content == "" {
		return nil, errors.New("message content cannot be empty")
	}
	if senderID != cs.PatientID && senderID != cs.DoctorID {
		return nil, errors.New("sender is not a participant in this chat session")
	}

	newMessage := Message{
		ID:       uuid.NewString(),
		SenderID: senderID,
		Content:  content,
		SentAt:   time.Now().UTC(),
	}

	cs.Messages = append(cs.Messages, newMessage)
	cs.LastActivity = newMessage.SentAt
	return &newMessage, nil
}

func (cs *ChatSession) GetMessages() []Message {
	msgs := make([]Message, len(cs.Messages))
	copy(msgs, cs.Messages)
	return msgs
}

func (cs *ChatSession) CanParticipantSend(participantID string) bool {
	return participantID == cs.PatientID || participantID == cs.DoctorID
}

func (cs *ChatSession) IsParticipant(participantID string) bool {
	return participantID == cs.PatientID || participantID == cs.DoctorID
}