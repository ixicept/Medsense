package doctorschedule

type ScheduleRepository interface {
	Save(schedule *Schedule) error
	FindByID(id string) (*Schedule, error)
	FindByDoctorID(doctorID string) ([]*Schedule, error)
	DeleteByID(id string) error
}
