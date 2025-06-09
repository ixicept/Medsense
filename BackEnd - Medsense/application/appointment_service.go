package application

import (
	"errors"
	"main/application/dto"
	"main/domain/appointment"
	"time"

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

func (s *AppointmentService) RequestAppointment(req dto.CreateAppointmentDTO) error {
	if err := s.validate.Struct(req); err != nil {
		return err // Validation error
	}

	appointmentRequest, err := appointment.NewAppointmentRequest(req)
	if err != nil {
		return err
	}

	return s.appointmentRepo.Save(*appointmentRequest)
}

func (s *AppointmentService) FindAppointmentRequestByID(id string) (*appointment.AppointmentRequest, error) {
	req, err := s.appointmentRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	return &req, nil
}

func (s *AppointmentService) FindAppointmentRequestsByPatientID(patientID string, statusFilter []appointment.AppointmentStatus, offset int, limit int) ([]*appointment.AppointmentRequest, int, error) {
	requests, totalCount, err := s.appointmentRepo.FindByPatientID(patientID, statusFilter, offset, limit)
	if err != nil {
		return nil, 0, err
	}

	return requests, totalCount, nil
}

func (s *AppointmentService) FindAppointmentRequestsByDoctorID(doctorID string, statusFilter []appointment.AppointmentStatus, offset int, limit int) ([]*appointment.AppointmentRequest, int, error) {
	requests, totalCount, err := s.appointmentRepo.FindByDoctorID(doctorID, statusFilter, offset, limit)
	if err != nil {
		return nil, 0, err
	}

	return requests, totalCount, nil
}

func (s *AppointmentService) ApproveAppointment(ID string) error {
	req, err := s.appointmentRepo.FindByID(ID)
	if err != nil {
		return err
	}

	if req.Status != appointment.StatusPending {
		return errors.New("cannot approve an appointment that is not pending")
	}

	scheduledTime := time.Now().Add(30 * time.Minute) // Example scheduled time
	if scheduledTime.Before(time.Now().Add(-5 * time.Minute)) {
		return errors.New("approved scheduled time cannot be in the past")
	}

	req.Status = appointment.StatusApproved
	req.ScheduledDateTime = scheduledTime
	req.UpdatedAt = time.Now().UTC()

	return s.appointmentRepo.Save(req)
}

func (s *AppointmentService) RejectAppointment(ID string) error {
	req, err := s.appointmentRepo.FindByID(ID)
	if err != nil {
		return err // Error from repository
	}

	if req.Status != appointment.StatusPending {
		return errors.New("cannot reject an appointment that is not pending")
	}

	req.Status = appointment.StatusDeclined
	req.UpdatedAt = time.Now().UTC()

	return s.appointmentRepo.Save(req)
}

func (s *AppointmentService) CompleteAppointment(ID string) error {
	req, err := s.appointmentRepo.FindByID(ID)
	if err != nil {
		return err // Error from repository
	}

	if req.Status != appointment.StatusApproved {
		return errors.New("cannot complete an appointment that is not approved")
	}

	req.Status = appointment.StatusCompleted
	req.UpdatedAt = time.Now().UTC()

	return s.appointmentRepo.Save(req)
}

func (s *AppointmentService) FindDoctorAppointmentsToday(doctorID string) ([]*appointment.AppointmentRequest, error) {

	appointment, err := s.appointmentRepo.FindDoctorAppointmentToday(doctorID, time.Now().UTC())

	if err != nil {
		return nil, err // Error from repository
	}

	return appointment, nil
}

func (s *AppointmentService) FindPatientAppointmentsToday(patientID string) ([]*appointment.AppointmentRequest, error) {
	appointment, err := s.appointmentRepo.FindPatientAppointmentToday(patientID, time.Now().UTC())

	if err != nil {
		return nil, err // Error from repository
	}

	return appointment, nil
}
