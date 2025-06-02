package auth

import (
	"errors"
	"main/application/dto"
	"time"

	"github.com/google/uuid"
)

type RegistrationStatus string

const (
	StatusPending  RegistrationStatus = "pending"
	StatusApproved RegistrationStatus = "approved"
	StatusRejected RegistrationStatus = "rejected"
)

type DoctorRegistration struct {
	ID             string
	Username       string
	Email          string
	HashedPassword string
	Role           string
	DateOfBirth    string
	PhoneNumber    string
	FileAttachment []byte
	Status         RegistrationStatus
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func NewDoctorRegistration(req dto.CreateRegistrationDTO) (*DoctorRegistration, error) {

	return &DoctorRegistration{
		ID:             uuid.NewString(),
		Username:       req.Username,
		Email:          req.Email,
		HashedPassword: req.Password,
		Role:           "doctor",
		DateOfBirth:    req.DateOfBirth,
		PhoneNumber:    req.PhoneNumber,
		FileAttachment: req.FileAttachment,
		Status:         StatusPending,
		CreatedAt:      time.Now().UTC(),
		UpdatedAt:      time.Now().UTC(),
	}, nil
}

func (dr *DoctorRegistration) Approve(adminID string) error {
	if dr.Status != StatusPending {
		return errors.New("registration is not in pending state, cannot approve")
	}
	if adminID == "" { 
		return errors.New("admin ID is required for approval")
	}
	dr.Status = StatusApproved
	dr.UpdatedAt = time.Now().UTC()
	return nil
}

func (dr *DoctorRegistration) Reject(adminID string) error {
	if dr.Status != StatusPending {
		return errors.New("registration is not in pending state, cannot reject")
	}
	if adminID == "" {
		return errors.New("admin ID is required for rejection")
	}
	dr.Status = StatusRejected
	dr.UpdatedAt = time.Now().UTC()
	return nil
}
