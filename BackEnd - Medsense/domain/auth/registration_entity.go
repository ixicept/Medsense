package auth

import (
	"errors"
	"time"

	"github.com/google/uuid"
)


type RegistrationID string
type RegistrationStatus string

const (
	StatusPending  RegistrationStatus = "pending"
	StatusApproved RegistrationStatus = "approved"
	StatusRejected RegistrationStatus = "rejected"
)

type DoctorRegistration struct {
	ID                RegistrationID
	DoctorFullName    string
	DoctorEmail       string 
	DoctorPhoneNumber string
	FileAttachment    string 
	Status            RegistrationStatus
	Reason            string 
	SubmittedAt       time.Time
	ReviewedAt        *time.Time 
	ReviewerAccountID string 
}

func NewDoctorRegistration(fullName string, email string, phoneNumber string, fileAttachment string) (*DoctorRegistration, error) {
	if fullName == "" {
		return nil, errors.New("doctor full name cannot be empty")
	}
	if email == "" {
		return nil, errors.New("doctor email cannot be empty")
	}
	if phoneNumber == "" {
		return nil, errors.New("doctor phone number cannot be empty")
	}

	return &DoctorRegistration{
		ID:                RegistrationID(uuid.NewString()),
		DoctorFullName:    fullName,
		DoctorEmail:       email,
		DoctorPhoneNumber: phoneNumber,
		FileAttachment:    fileAttachment,
		Status:            StatusPending,
		SubmittedAt:       time.Now().UTC(),
	}, nil
}

func (dr *DoctorRegistration) Approve(adminID string) error {
	if dr.Status != StatusPending {
		return errors.New("registration is not in pending state, cannot approve")
	}
	if adminID == "" { // Basic check
		return errors.New("admin ID is required for approval")
	}
	now := time.Now().UTC()
	dr.Status = StatusApproved
	dr.ReviewedAt = &now
	dr.ReviewerAccountID = adminID
	dr.Reason = "" // Clear any previous rejection reason
	return nil
}

func (dr *DoctorRegistration) Reject(adminID string, reason string) error {
	if dr.Status != StatusPending {
		return errors.New("registration is not in pending state, cannot reject")
	}
	if adminID == "" {
		return errors.New("admin ID is required for rejection")
	}
	if reason == "" {
		return errors.New("rejection reason cannot be empty")
	}
	now := time.Now().UTC()
	dr.Status = StatusRejected
	dr.ReviewedAt = &now
	dr.ReviewerAccountID = adminID
	dr.Reason = reason
	return nil
}
