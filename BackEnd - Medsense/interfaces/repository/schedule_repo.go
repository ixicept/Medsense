package repository

import (
	doctorschedule "main/domain/doctor_schedule"

	"gorm.io/gorm"
)

type ScheduleRepository struct {
	db *gorm.DB
}

func NewScheduleRepository(db *gorm.DB) doctorschedule.ScheduleRepository {
	return &ScheduleRepository{db: db}
}

func (r *ScheduleRepository) Save(schedule *doctorschedule.Schedule) error {
	var existingSchedule doctorschedule.Schedule

	if err := r.db.Where("id = ?", schedule.ID).First(&existingSchedule).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			if err := r.db.Create(schedule).Error; err != nil {
				return err
			}
		} else {
			return err
		}
	} else {
		if err := r.db.Save(schedule).Error; err != nil {
			return err
		}
	}
	return nil
}

func (r *ScheduleRepository) FindByID(id string) (*doctorschedule.Schedule, error) {
	var schedule doctorschedule.Schedule
	if err := r.db.First(&schedule, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &schedule, nil
}

func (r *ScheduleRepository) FindByDoctorID(doctorID string) ([]*doctorschedule.Schedule, error) {
	var schedules []*doctorschedule.Schedule
	if err := r.db.Find(&schedules, "doctor_id = ?", doctorID).Error; err != nil {
		return nil, err
	}
	return schedules, nil
}

func (r *ScheduleRepository) DeleteByID(id string) error {
	var schedule doctorschedule.Schedule
	if err := r.db.First(&schedule, "id = ?", id).Error; err != nil {
		return err
	}
	if err := r.db.Delete(&schedule).Error; err != nil {
		return err
	}
	return nil
}
