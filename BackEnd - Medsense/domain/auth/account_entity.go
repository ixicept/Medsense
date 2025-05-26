package auth

import (
	"errors"
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
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func NewAccount(email string, rawPassword string, role string) (*Account, error) {
	if email == "" {
		return nil, errors.New("email cannot be empty")
	}
	if len(rawPassword) < 8 {
		return nil, errors.New("password must be at least 8 characters long")
	}
	if role != RolePatient && role != RoleDoctor && role != RoleAdmin {
		return nil, errors.New("invalid user role specified")
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(rawPassword), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password: " + err.Error())
	}

	return &Account{
		ID:             uuid.NewString(),
		Email:          email,
		HashedPassword: string(hashedPass),
		Role:           role,
		CreatedAt:      time.Now().UTC(),
		UpdatedAt:      time.Now().UTC(),
	}, nil
}

func (a *Account) CheckPassword(rawPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(a.HashedPassword), []byte(rawPassword))
	return err == nil
}

func (a *Account) ChangePassword(newRawPassword string) error {
	if len(newRawPassword) < 8 {
		return errors.New("new password must be at least 8 characters long")
	}
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(newRawPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash new password: " + err.Error())
	}
	a.HashedPassword = string(hashedPass)
	a.UpdatedAt = time.Now().UTC()
	return nil
}

func (a *Account) SetEmail(newEmail string) error {
	if newEmail == "" {
		return errors.New("email cannot be empty")
	}
	a.Email = newEmail
	a.UpdatedAt = time.Now().UTC()
	return nil
}

func (a *Account) SetUsername(newUsername string) error {
	if newUsername == "" {
		return errors.New("username cannot be empty")
	}
	a.Username = newUsername
	a.UpdatedAt = time.Now().UTC()
	return nil
}

// SetRole updates the account's role.
func (a *Account) SetRole(newRole string) error {
	if newRole != RolePatient && newRole != RoleDoctor && newRole != RoleAdmin {
		return errors.New("invalid user role to set")
	}
	a.Role = newRole
	a.UpdatedAt = time.Now().UTC()
	return nil
}
