package chat

type ChatService interface {
	StartChatSession(patientID string, doctorID string) (*ChatSession, error)
	SendMessage(sessionID string, senderID string, message string) (*Message, error)
	FindChatSessionWithMessages(patientID string, doctorID string, offset int, limit int) ([]*ChatSession, int, error)
	FindChatSessionByParticipants(patientID string, doctorID string) (*ChatSession, error)
}
