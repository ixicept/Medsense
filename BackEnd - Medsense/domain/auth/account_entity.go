package auth

import (
	"errors"
	"main/application/dto"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

const (
	RolePatient string = "patient"
	RoleDoctor  string = "doctor"
	RoleAdmin   string = "admin"
)

type Account struct {
	ID             string
	Username       string
	Email          string
	HashedPassword string
	Role           string
	DateOfBirth    string
	PhoneNumber    string
	Location       string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func NewAccount(req dto.CreateUserDTO) (*Account, error) {

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password: " + err.Error())
	}

	return &Account{
		ID:             uuid.NewString(),
		Email:          req.Email,
		HashedPassword: string(hashedPass),
		Role:           "patient",
		DateOfBirth:    req.DateOfBirth,
		PhoneNumber:    req.PhoneNumber,
		Location:       req.Location,
		Username:       req.Username,
		CreatedAt:      time.Now().UTC(),
		UpdatedAt:      time.Now().UTC(),
	}, nil
}

func (a *Account) CheckPassword(rawPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(a.HashedPassword), []byte(rawPassword))
	return err == nil
}

// func (a *Account) ChangePassword(newRawPassword string) error {
// 	if len(newRawPassword) < 8 {
// 		return errors.New("new password must be at least 8 characters long")
// 	}
// 	hashedPass, err := bcrypt.GenerateFromPassword([]byte(newRawPassword), bcrypt.DefaultCost)
// 	if err != nil {
// 		return errors.New("failed to hash new password: " + err.Error())
// 	}
// 	a.HashedPassword = string(hashedPass)
// 	a.UpdatedAt = time.Now().UTC()
// 	return nil
// }
