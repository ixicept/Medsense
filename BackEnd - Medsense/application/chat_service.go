package application

import (
	"fmt"
	"main/domain/chat"
)

type ChatService struct {
	chatRepo chat.ChatSessionRepository
}

func NewChatService(chatRepo chat.ChatSessionRepository) chat.ChatService {
	return &ChatService{chatRepo: chatRepo}
}

func (s *ChatService) StartChatSession(patientID string, doctorID string) (*chat.ChatSession, error) {

	if patientID == "" || doctorID == "" {
		return nil, fmt.Errorf("%w: patientID and doctorID must be provided")
	}

	// Check if a session already exists between these participants
	existingSession, err := s.chatRepo.FindByParticipants(patientID, doctorID)
	if err != nil { // Assuming repo returns a specific not found
		return nil, fmt.Errorf("error checking for existing session: %w", err)
	}

	if existingSession != nil {
		// Session already exists, return it
	}

	// No existing session, create a new one
	newSession, err := chat.NewChatSession(patientID, doctorID)
	if err != nil {
		return nil, fmt.Errorf("%w", err.Error())
	}

	if err := s.chatRepo.Save(newSession); err != nil {
		return nil, fmt.Errorf("%w", err.Error())
	}

	// TODO: Publish ChatSessionStartedEvent if using domain events
	// s.eventPublisher.Publish(ctx, domainChat.NewChatSessionStartedEvent(newSession.ID, newSession.PatientID, newSession.DoctorID))

	return newSession, nil
}

func (s *ChatService) SendMessage(sessionID string, senderID string, content string) (*chat.Message, error) {
	session, err := s.chatRepo.FindByID(sessionID)
	if err != nil {
		return nil, fmt.Errorf("error finding chat session: %w", err)
	}

	if session == nil {
		return nil, fmt.Errorf("chat session with ID %s not found", sessionID)
	}

	message, err := session.AddMessage(senderID, content)
	if err != nil {
		return nil, fmt.Errorf("error adding message to chat session: %w", err)
	}

	if err := s.chatRepo.Save(session); err != nil {
		return nil, fmt.Errorf("error saving chat session after adding message: %w", err)
	}
	return message, nil
}

func (s *ChatService) FindChatSessionWithMessages(patientID string, doctorID string, offset int, limit int) ([]*chat.ChatSession, int, error) {
	sessions, totalCount, err := s.chatRepo.FindByParticipantID(patientID, offset, limit)
	if err != nil {
		return nil, 0, fmt.Errorf("error finding chat sessions: %w", err)
	}

	if len(sessions) == 0 {
		return nil, 0, nil // No sessions found
	}

	// Load messages for each session
	for _, session := range sessions {
		session.Messages = session.GetMessages() // Assuming GetMessages returns the messages for the session
	}

	return sessions, totalCount, nil
}

func (s *ChatService) FindChatSessionByParticipants(patientID string, doctorID string) (*chat.ChatSession, error) {
	session, err := s.chatRepo.FindByParticipants(patientID, doctorID)
	if err != nil {
		return nil, fmt.Errorf("error finding chat session by participants: %w", err)
	}

	if session == nil {
		return nil, fmt.Errorf("no chat session found between patient %s and doctor %s", patientID, doctorID)
	}

	session.Messages = session.GetMessages() // Load messages for the session
	return session, nil
}
