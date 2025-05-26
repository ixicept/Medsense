package application

import (
	"fmt"
	"main/application/dto"
	"main/domain/auth"
	"net/http"
	"time"
)

type AuthService struct {
	accountRepo auth.AccountRepository
	client      *http.Client
}

func NewAuthService(accountRepo auth.AccountRepository) auth.Service {
	return &AuthService{
		accountRepo: accountRepo,
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

	fmt.Println("Creating new account with email:", createUserReq.Email)

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
	// accountData, err := s.repo.GetAccountByEmail(email)
	// if err != nil {
	// 	return auth.Account{}, err
	// }

	return nil, nil
}

func (s *AuthService) FindByID(id string) (*auth.Account, error) {
	// accountData, err := s.repo.GetAccountByID(string(id))
	// if err != nil {
	// 	return auth.Account{}, err
	// }

	return nil, nil
}

func (s *AuthService) ApproveRegistration(id string, adminID string) error {
	// Here you would typically update the registration status in the database
	// to indicate that it has been approved by the admin.
	// This is a placeholder implementation.
	return nil
}

// func (s *AuthService) SubmitDocterRegistration(registration auth.DoctorRegistration) (string, error) {
// 	err := s.registrationRepo.Save(registration)
// 	if err != nil {
// 		return "", err // Handle error from repository
// 	}

// 	return "", nil // Return the ID of the newly created registration
// }
// func (s *AuthService) FindPendingRegistrations(offset int, limit int) ([]auth.DoctorRegistration, int, error) {
// 	registrations, totalCount, err := s.registrationRepo.FindPending(offset, limit)
// 	if err != nil {
// 		return nil, 0, err // Handle error from repository
// 	}

// 	return registrations, totalCount, nil // Return the list of registrations and the total count
// }
