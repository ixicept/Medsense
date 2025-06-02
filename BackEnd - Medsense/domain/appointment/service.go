package appointment

import (
	"main/application/dto"
)

type Service interface {
	RequestAppointment(req dto.CreateAppointmentDTO) error
	FindAppointmentRequestByID(id string) (*AppointmentRequest, error)
	FindAppointmentRequestsByPatientID(patientID string, statusFilter []AppointmentStatus, offset int, limit int) ([]*AppointmentRequest, int, error)
	FindAppointmentRequestsByDoctorID(doctorID string, statusFilter []AppointmentStatus, offset int, limit int) ([]*AppointmentRequest, int, error)
	ApproveAppointment(ID string) error
	RejectAppointment(ID string) error
	CompleteAppointment(ID string) error
	FindDoctorAppointmentsToday(doctorID string) ([]*AppointmentRequest, error)
	FindPatientAppointmentsToday(patientID string) ([]*AppointmentRequest, error)
}
