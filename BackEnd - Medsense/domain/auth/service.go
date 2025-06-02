package auth

import "main/application/dto"

type Service interface {
	CreateAccount(createUserReq dto.CreateUserDTO) (*Account, error)
	Login(email, password string) (*Account, error)
	FindByID(id string) (*Account, error)
	FindByEmail(email string) (*Account, error)
	ApproveRegistration(id string, adminID string) error
	SubmitDocterRegistration(registration dto.CreateRegistrationDTO) (error)
	FindPendingRegistrations(offset int, limit int) ([]DoctorRegistration, int, error)
	FindByRole(role string, offset int, limit int) ([]Account, int, error)
	DeclineRegistration(id string, adminID string) error
	FindByDoctorID(doctorID string) (*Account, error)
}
