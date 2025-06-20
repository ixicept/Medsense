package repository

import (
	"main/domain/auth"
	"time"

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
	existingAccount.UpdatedAt = time.Now().UTC()

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

func (r *UserRepository) FindByRole(role string, offset int, limit int) ([]auth.Account, int, error) {
	var accounts []auth.Account
	var totalCount int64

	query := r.db.Model(&auth.Account{}).Where("role = ?", role)

	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Offset(offset).Limit(limit).Find(&accounts).Error; err != nil {
		return nil, 0, err
	}

	return accounts, int(totalCount), nil
}

func (r *UserRepository) FindByDoctorID(doctorID string) (auth.Account, error) {
	var account auth.Account
	if err := r.db.Where("id = ?", doctorID).First(&account).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return auth.Account{}, nil // No account found
		}
		return auth.Account{}, err // Other error
	}
	return account, nil
}
