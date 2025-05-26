package auth

import "main/application/dto"

type Service interface {
	CreateAccount(createUserReq dto.CreateUserDTO) (*Account, error)
	Login(email, password string) (*Account, error)
	FindByID(id string) (*Account, error)
	FindByEmail(email string) (*Account, error)
	ApproveRegistration(id string, adminID string) error
	// SubmitDocterRegistration(registration DoctorRegistration) (string, error)
	// FindPendingRegistrations(offset int, limit int) ([]DoctorRegistration, int, error)
}
