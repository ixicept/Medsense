package application

import (
	"fmt"
	"main/application/dto"
	"main/domain/auth"
	"net/http"
	"time"
)

type AuthService struct {
	accountRepo      auth.AccountRepository
	registrationRepo auth.DoctorRegistrationRepository
	client           *http.Client
}

func NewAuthService(accountRepo auth.AccountRepository, registrationRepo auth.DoctorRegistrationRepository) auth.Service {
	return &AuthService{
		accountRepo:      accountRepo,
		registrationRepo: registrationRepo,
		client: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

func (s *AuthService) CreateAccount(createUserReq dto.CreateUserDTO) (*auth.Account, error) {

	newAccount, err := auth.NewAccount(createUserReq)
	if err != nil {
		return nil, err
	}

	s.accountRepo.CreateAccount(*newAccount)

	return newAccount, nil
}

func (s *AuthService) Login(email, password string) (*auth.Account, error) {
	account, err := s.accountRepo.FindByEmail(email)
	if err != nil {
		return nil, fmt.Errorf("failed to find account by email: %w", err)
	}

	fmt.Print("Logging in with email:", email)

	if !account.CheckPassword(password) {
		return nil, fmt.Errorf("invalid password for account with email %s", email)
	}

	return &account, nil
}

func (s *AuthService) FindByEmail(email string) (*auth.Account, error) {
	accountData, err := s.accountRepo.FindByEmail(email)
	if err != nil {
		return nil, err
	}

	return &accountData, nil
}

func (s *AuthService) FindByID(id string) (*auth.Account, error) {
	accountData, err := s.accountRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	return &accountData, nil
}

func (s *AuthService) ApproveRegistration(id string, adminID string) error {
	registration, err := s.registrationRepo.FindByID(id)
	if err != nil {
		return err
	}
	err = registration.Approve(adminID)
	s.registrationRepo.CreateRegistration(registration)

	var req = dto.CreateUserDTO{
		Username:    registration.Username,
		Email:       registration.Email,
		Password:    registration.HashedPassword,
		PhoneNumber: registration.PhoneNumber,
		DateOfBirth: registration.DateOfBirth,
		Location:    "Doctor Place",
	}

	s.CreateAccount(req)
	if err != nil {
		return err
	}
	return nil
}

func (s *AuthService) DeclineRegistration(id string, adminID string) error {
	registration, err := s.registrationRepo.FindByID(id)
	if err != nil {
		return err
	}
	err = registration.Reject(adminID)
	s.registrationRepo.CreateRegistration(registration)
	if err != nil {
		return err
	}
	return nil
}

func (s *AuthService) SubmitDocterRegistration(registration dto.CreateRegistrationDTO) error {

	newRegistration, err := auth.NewDoctorRegistration(registration)

	if err != nil {
		return err
	}

	s.registrationRepo.CreateRegistration(*newRegistration)

	return err
}
func (s *AuthService) FindPendingRegistrations(offset int, limit int) ([]auth.DoctorRegistration, int, error) {
	registrations, totalCount, err := s.registrationRepo.FindPending(offset, limit)
	if err != nil {
		return nil, 0, err
	}

	return registrations, totalCount, nil
}

func (s *AuthService) FindByRole(role string, offset int, limit int) ([]auth.Account, int, error) {
	accounts, totalCount, err := s.accountRepo.FindByRole(role, offset, limit)
	if err != nil {
		return nil, 0, err
	}

	return accounts, totalCount, nil
}

func (s *AuthService) FindByDoctorID(doctorID string) (*auth.Account, error) {
	account, err := s.accountRepo.FindByDoctorID(doctorID)
	if err != nil {
		return nil, fmt.Errorf("failed to find account by doctor ID: %w", err)
	}

	if account.ID == "" {
		return nil, fmt.Errorf("no account found for doctor ID: %s", doctorID)
	}

	return &account, nil
}
