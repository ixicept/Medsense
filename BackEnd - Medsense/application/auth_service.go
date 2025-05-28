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
	_, err := s.accountRepo.FindByEmail(createUserReq.Email)
	if err != nil {
		return nil, err
	}

	newAccount, err := auth.NewAccount(createUserReq)
	if err != nil {
		return nil, err // Error from domain (e.g., "password too short")
	}

	s.accountRepo.CreateAccount(*newAccount)

	return newAccount, nil
}

func (s *AuthService) Login(email, password string) (*auth.Account, error) {
	account, err := s.accountRepo.FindByEmail(email)
	if err != nil {
		return nil, fmt.Errorf("failed to find account by email: %w", err)
	}

	if &account == nil {
		return nil, fmt.Errorf("no account found with email %s", email)
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
	// Here you would typically update the registration status in the database
	// to indicate that it has been approved by the admin.
	// This is a placeholder implementation.
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
