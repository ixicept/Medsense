package appointment

import (
	"time"
)

type AppointmentRepository interface {
	Save(req AppointmentRequest) error
	FindByID(id string) (AppointmentRequest, error)
	FindByPatientID(patientID string, statusFilter []AppointmentStatus, offset int, limit int) (requests []*AppointmentRequest, totalCount int, err error)
	FindByDoctorID(doctorID string, statusFilter []AppointmentStatus, offset int, limit int) (requests []*AppointmentRequest, totalCount int, err error)
	FindByDoctorIDAndDateRange(doctorID string, startTime time.Time, endTime time.Time) ([]*AppointmentRequest, error)
}
