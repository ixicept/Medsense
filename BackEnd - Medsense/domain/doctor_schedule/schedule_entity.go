package doctorschedule

import (
	"main/application/dto"
	"time"
)

type Schedule struct {
	DoctorID      string `gorm:"primaryKey"`	
	HospitalID    string
	Day           string `gorm:"primaryKey"`
	ScheduleStart time.Time
	ScheduleEnd   time.Time
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func NewSchedule(req dto.CreateScheduleDTO) (*Schedule, error) {
	scheduleStart, err := time.Parse(time.RFC3339, req.ScheduleStart)
	if err != nil {
		return nil, err
	}

	scheduleEnd, err := time.Parse(time.RFC3339, req.ScheduleEnd)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	return &Schedule{
		DoctorID:      req.DoctorID,
		HospitalID:    req.HospitalID,
		Day:           req.Day,
		ScheduleStart: scheduleStart,
		ScheduleEnd:   scheduleEnd,
		CreatedAt:     now,
		UpdatedAt:     now,
	}, nil
}
