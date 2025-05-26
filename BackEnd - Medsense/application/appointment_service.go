package application

import (
	"main/domain/appointment"

	"github.com/go-playground/validator/v10"
)

type AppointmentService struct {
	appointmentRepo appointment.AppointmentRepository
	validate        *validator.Validate
}

func NewAppointmentService(appointmentRepo appointment.AppointmentRepository, validate *validator.Validate) appointment.Service {
	return &AppointmentService{
		appointmentRepo: appointmentRepo,
		validate:        validate,
	}
}

func (s *AppointmentService) RequestAppointment(req *appointment.AppointmentRequest) error {
	if err := s.validate.Struct(req); err != nil {
		return err // Validation error
	}

	return s.appointmentRepo.Save(req)
}

func (s *AppointmentService) FindAppointmentRequestByID(id string) (*appointment.AppointmentRequest, error) {
	req, err := s.appointmentRepo.FindByID(id)
	if err != nil {
		return nil, err // Error from repository
	}

	return req, nil
}

func (s *AppointmentService) FindAppointmentRequestsByPatientID(patientID string, statusFilter []appointment.AppointmentStatus, offset int, limit int) ([]*appointment.AppointmentRequest, int, error) {
	requests, totalCount, err := s.appointmentRepo.FindByPatientID(patientID, statusFilter, offset, limit)
	if err != nil {
		return nil, 0, err // Error from repository
	}

	return requests, totalCount, nil
}

func (s *AppointmentService) FindAppointmentRequestsByDoctorID(doctorID string, statusFilter []appointment.AppointmentStatus, offset int, limit int) ([]*appointment.AppointmentRequest, int, error) {
	requests, totalCount, err := s.appointmentRepo.FindByDoctorID(doctorID, statusFilter, offset, limit)
	if err != nil {
		return nil, 0, err // Error from repository
	}

	return requests, totalCount, nil
}

func (s *AppointmentService) ApproveAppointment(req *appointment.AppointmentRequest) error {
	if err := s.validate.Struct(req); err != nil {
		return err // Validation error
	}

	req.Status = appointment.StatusApproved
	return s.appointmentRepo.Save(req)
}

func (s *AppointmentService) RejectAppointment(req *appointment.AppointmentRequest) error {
	if err := s.validate.Struct(req); err != nil {
		return err // Validation error
	}

	req.Status = appointment.StatusDeclined
	return s.appointmentRepo.Save(req)
}

func (s *AppointmentService) CompleteAppointment(req *appointment.AppointmentRequest) error {
	if err := s.validate.Struct(req); err != nil {
		return err // Validation error
	}

	req.Status = appointment.StatusCompleted
	return s.appointmentRepo.Save(req)
}
