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

func (r *UserRepository) CreateAccount(account auth.Account) (string, error) {
	var existingAccount auth.Account
	// create or update

	if err := r.db.Where("email = ?", account.Email).First(&existingAccount).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			if err := r.db.Create(&account).Error; err != nil {
				return "", err
			}
			return account.ID, nil
		}
		return "", err
	}

	existingAccount.Username = account.Username
	existingAccount.HashedPassword = account.HashedPassword
	existingAccount.Role = account.Role
	existingAccount.DateOfBirth = account.DateOfBirth
	existingAccount.PhoneNumber = account.PhoneNumber
	existingAccount.Location = account.Location

	if err := r.db.Save(&existingAccount).Error; err != nil {
		return "", err
	}
	return existingAccount.ID, nil
}

func (r *UserRepository) FindByEmail(email string) (auth.Account, error) {
	var account auth.Account
	if err := r.db.Where("email = ?", email).First(&account).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return auth.Account{}, nil // No account found
		}
		return auth.Account{}, err // Other error
	}
	return account, nil
}

func (r *UserRepository) FindByID(id string) (auth.Account, error) {
	var account auth.Account
	if err := r.db.Where("id = ?", id).First(&account).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return auth.Account{}, nil // No account found
		}
		return auth.Account{}, err // Other error
	}
	return account, nil
}
