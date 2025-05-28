package appointment

import (
	"errors"
	"main/application/dto"
	"time"

	"github.com/google/uuid"
)

type AppointmentStatus string

const (
	StatusPending   AppointmentStatus = "PENDING"
	StatusApproved  AppointmentStatus = "APPROVED"
	StatusDeclined  AppointmentStatus = "DECLINED"
	StatusCancelled AppointmentStatus = "CANCELLED"
	StatusCompleted AppointmentStatus = "COMPLETED"
)

type AppointmentRequest struct {
	ID                string
	PatientID         string
	DoctorID          string
	RequestedDateTime time.Time
	Reason            string
	Status            AppointmentStatus
	PatientNotes      string
	DoctorNotes       string
	DeclineReason     string
	ScheduledDateTime time.Time
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

func NewAppointmentRequest(req dto.CreateAppointmentDTO) (*AppointmentRequest, error) {

	requestedDateTime, _ := time.Parse(time.RFC3339, req.RequestedTime)
	now := time.Now().UTC()
	return &AppointmentRequest{
		ID:                uuid.NewString(),
		PatientID:         req.PatientID,
		DoctorID:          req.DoctorID,
		RequestedDateTime: requestedDateTime,
		ScheduledDateTime: time.Time{},
		Reason:            req.Reason,
		PatientNotes:      "",
		Status:            StatusPending,
		CreatedAt:         now,
		UpdatedAt:         now,
	}, nil
}

func (ar *AppointmentRequest) Approve(doctorNotes string, scheduledTime time.Time) error {
	if ar.Status != StatusPending {
		return errors.New("cannot approve an appointment that is not pending")
	}
	if scheduledTime.Before(time.Now().Add(-5 * time.Minute)) {
		return errors.New("approved scheduled time cannot be in the past")
	}

	ar.Status = StatusApproved
	ar.DoctorNotes = doctorNotes
	ar.ScheduledDateTime = scheduledTime
	ar.DeclineReason = ""
	ar.UpdatedAt = time.Now().UTC()
	return nil
}

func (ar *AppointmentRequest) Decline(actorIsDoctor bool, reason string) error {
	if ar.Status != StatusPending && ar.Status != StatusApproved {
		return errors.New("cannot decline/cancel an appointment that is not pending or approved")
	}
	if reason == "" {
		return errors.New("a reason is required for declining or cancelling")
	}

	if actorIsDoctor {
		ar.Status = StatusDeclined
	} else {
		ar.Status = StatusCancelled
	}
	ar.DeclineReason = reason
	ar.UpdatedAt = time.Now().UTC()
	return nil
}

func (ar *AppointmentRequest) Complete(doctorNotes string) error {
	if ar.Status != StatusApproved {
		return errors.New("only an approved appointment can be marked as completed")
	}
	if ar.ScheduledDateTime.After(time.Now()) {
		return errors.New("appointment cannot be marked as completed before its scheduled time")
	}
	ar.Status = StatusCompleted
	ar.DoctorNotes = doctorNotes
	ar.UpdatedAt = time.Now().UTC()
	return nil
}
func (ar *AppointmentRequest) AddDoctorReply(replyText string) error {
	if ar.Status == StatusCompleted || ar.Status == StatusCancelled || ar.Status == StatusDeclined {
		return errors.New("cannot add reply to a finalized appointment request")
	}

	if ar.DoctorNotes != "" {
		ar.DoctorNotes += "\nReply: " + replyText
	} else {
		ar.DoctorNotes = "Reply: " + replyText
	}
	ar.UpdatedAt = time.Now().UTC()
	return nil
}
