package appointment

type Service interface {
	RequestAppointment(req *AppointmentRequest) error
	FindAppointmentRequestByID(id string) (*AppointmentRequest, error)
	FindAppointmentRequestsByPatientID(patientID string, statusFilter []AppointmentStatus, offset int, limit int) ([]*AppointmentRequest, int, error)
	FindAppointmentRequestsByDoctorID(doctorID string, statusFilter []AppointmentStatus, offset int, limit int) ([]*AppointmentRequest, int, error)
	ApproveAppointment(req *AppointmentRequest) error
	RejectAppointment(req *AppointmentRequest) error
	CompleteAppointment(req *AppointmentRequest) error
}
