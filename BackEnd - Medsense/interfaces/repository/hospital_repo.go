package repository

import (
	"main/domain/hospital"

	"gorm.io/gorm"
)

type HospitalRepository struct {
	db *gorm.DB
}

func NewHospitalRepository(db *gorm.DB) hospital.HospitalRepository {
	return &HospitalRepository{db: db}
}

func (r *HospitalRepository) Save(req *hospital.Hospital) error {
	var existingHospital hospital.Hospital

	if err := r.db.Where("id = ?", req.ID).First(&existingHospital).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			if err := r.db.Create(req).Error; err != nil {
				return err
			}
		} else {
			return err
		}
	} else {
		if err := r.db.Save(req).Error; err != nil {
			return err
		}
	}
	return nil
}

func (r *HospitalRepository) FindByID(id string) (*hospital.Hospital, error) {
	var hospitalEntity hospital.Hospital
	if err := r.db.First(&hospitalEntity, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &hospitalEntity, nil
}

func (r *HospitalRepository) GetAllHospitals(offset int, limit int) ([]*hospital.Hospital, int, error) {
	var hospitals []*hospital.Hospital
	var totalCount int64

	query := r.db.Model(&hospital.Hospital{})

	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Offset(offset).Limit(limit).Find(&hospitals).Error; err != nil {
		return nil, 0, err
	}

	return hospitals, int(totalCount), nil
}

func (r *HospitalRepository) DeleteByID(id string) error {
	var hospitalEntity hospital.Hospital
	if err := r.db.First(&hospitalEntity, "id = ?", id).Error; err != nil {
		return err
	}
	if err := r.db.Delete(&hospitalEntity).Error; err != nil {
		return err
	}
	return nil
}
