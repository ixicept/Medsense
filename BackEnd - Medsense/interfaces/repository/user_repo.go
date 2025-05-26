package repository

import (
	"main/domain/auth"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) auth.AccountRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateAccount(email, password string) (string, error) {
	return "", nil 
}

func (r *UserRepository) FindByEmail(email string) (string, error) {

	return "", nil 
}

func (r *UserRepository) FindByID(id string) (string, error) {

	return "", nil 
}