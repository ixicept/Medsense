package application

import (
	"main/application/dto"
	doctorschedule "main/domain/doctor_schedule"

	"github.com/go-playground/validator/v10"
)

type ScheduleService struct {
	scheduleRepository doctorschedule.ScheduleRepository
	validate           *validator.Validate
}

func NewScheduleService(scheduleRepository doctorschedule.ScheduleRepository, validate *validator.Validate) doctorschedule.Service {
	return &ScheduleService{
		scheduleRepository: scheduleRepository,
		validate:           validate,
	}
}

func (s *ScheduleService) Save(req dto.CreateScheduleDTO) error {
	if err := s.validate.Struct(req); err != nil {
		return err
	}

	schedule, err := doctorschedule.NewSchedule(req)
	if err != nil {
		return err
	}
	schedule.ID = req.ID 
	return s.scheduleRepository.Save(schedule)
}

func (s *ScheduleService) FindByID(id string) (*doctorschedule.Schedule, error) {
	schedule, err := s.scheduleRepository.FindByID(id)
	if err != nil {
		return nil, err
	}
	return schedule, nil
}

func (s *ScheduleService) FindByDoctorID(doctorID string) ([]*doctorschedule.Schedule, error) {
	schedules, err := s.scheduleRepository.FindByDoctorID(doctorID)
	if err != nil {
		return nil, err
	}
	return schedules, nil
}

func (s *ScheduleService) DeleteByID(id string) error {
	if err := s.scheduleRepository.DeleteByID(id); err != nil {
		return err
	}
	return nil
}
