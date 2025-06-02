package doctorschedule

import "main/application/dto"

type Service interface {
	Save(schedule dto.CreateScheduleDTO) error
	FindByID(id string) (*Schedule, error)
	FindByDoctorID(doctorID string) ([]*Schedule, error)
	DeleteByID(id string) error
}
