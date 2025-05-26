package chat

type ChatSessionRepository interface {
	Save(session *ChatSession) error
	FindByID(id string) (*ChatSession, error)
	FindByParticipantID(participantID string, offset int, limit int) (sessions []*ChatSession, totalCount int, err error)
	FindByParticipants(patientID string, doctorID string) (*ChatSession, error)
}
