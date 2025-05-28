package repository

import (
	"main/domain/appointment"
	"time"

	"gorm.io/gorm"
)

type AppointmentRepository struct {
	db *gorm.DB
}

func NewAppointmentRepository(db *gorm.DB) appointment.AppointmentRepository {
	return &AppointmentRepository{db: db}
}

func (r *AppointmentRepository) Save(req appointment.AppointmentRequest) error {

	var existingAppointment appointment.AppointmentRequest

	if err := r.db.Where("id = ?", req.ID).First(&existingAppointment).Error; err != nil {
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

func (r *AppointmentRepository) FindByID(id string) (appointment.AppointmentRequest, error) {
	var req appointment.AppointmentRequest
	if err := r.db.First(&req, "id = ?", id).Error; err != nil {
		return appointment.AppointmentRequest{}, err
	}
	return req, nil
}

func (r *AppointmentRepository) FindByPatientID(patientID string, statusFilter []appointment.AppointmentStatus, offset int, limit int) ([]*appointment.AppointmentRequest, int, error) {
	var appointments []*appointment.AppointmentRequest
	var totalCount int64

	query := r.db.Model(&appointment.AppointmentRequest{}).Where("patient_id = ?", patientID)

	if len(statusFilter) > 0 {
		query = query.Where("status IN ?", statusFilter)
	}

	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Offset(offset).Limit(limit).Find(&appointments).Error; err != nil {
		return nil, 0, err
	}

	return appointments, int(totalCount), nil
}

func (r *AppointmentRepository) FindByDoctorID(doctorID string, statusFilter []appointment.AppointmentStatus, offset int, limit int) ([]*appointment.AppointmentRequest, int, error) {
	var appointments []*appointment.AppointmentRequest
	var totalCount int64

	query := r.db.Model(&appointment.AppointmentRequest{}).Where("doctor_id = ?", doctorID)

	if len(statusFilter) > 0 {
		query = query.Where("status IN ?", statusFilter)
	}

	if err := query.Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Offset(offset).Limit(limit).Find(&appointments).Error; err != nil {
		return nil, 0, err
	}

	return appointments, int(totalCount), nil
}

func (r *AppointmentRepository) FindByDoctorIDAndDateRange(doctorID string, startTime time.Time, endTime time.Time) ([]*appointment.AppointmentRequest, error) {
	var appointments []*appointment.AppointmentRequest

	if err := r.db.Where("doctor_id = ? AND start_time >= ? AND end_time <= ?", doctorID, startTime, endTime).Find(&appointments).Error; err != nil {
		return nil, err
	}

	return appointments, nil
}
