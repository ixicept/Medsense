package repository

import (
	"main/domain/auth"

	"gorm.io/gorm"
)

type DoctorRegistrationRepository struct {
	db *gorm.DB
}

func NewDoctorRegistrationRepository(db *gorm.DB) auth.DoctorRegistrationRepository {
	return &DoctorRegistrationRepository{db: db}
}

func (r *DoctorRegistrationRepository) CreateRegistration(registration auth.DoctorRegistration) error {
	var existingRegistration auth.DoctorRegistration
	if err := r.db.Where("email = ?", registration.Email).First(&existingRegistration).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			if err := r.db.Create(&registration).Error; err != nil {
				return err
			}
			return nil
		}
		return err 
	}
	existingRegistration.Status = registration.Status

	return r.db.Save(&existingRegistration).Error
}

func (r *DoctorRegistrationRepository) FindByID(id string) (auth.DoctorRegistration, error) {
	var registration auth.DoctorRegistration
	if err := r.db.First(&registration, "id = ?", id).Error; err != nil {
		return auth.DoctorRegistration{}, err
	}
	return registration, nil
}

func (r *DoctorRegistrationRepository) FindByEmail(email string) (auth.DoctorRegistration, error) {
	var registration auth.DoctorRegistration
	if err := r.db.First(&registration, "email = ?", email).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return auth.DoctorRegistration{}, nil
		}
		return auth.DoctorRegistration{}, err
	}
	return registration, nil
}

func (r *DoctorRegistrationRepository) FindPending(offset int, limit int) ([]auth.DoctorRegistration, int, error) {
	var registrations []auth.DoctorRegistration
	var totalCount int64

	if err := r.db.Model(&auth.DoctorRegistration{}).Where("status = ?", "pending").Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Where("status = ?", "pending").Offset(offset).Limit(limit).Find(&registrations).Error; err != nil {
		return nil, 0, err
	}

	return registrations, int(totalCount), nil
}
