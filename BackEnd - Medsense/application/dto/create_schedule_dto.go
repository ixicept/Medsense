package dto

type CreateScheduleDTO struct {
	ID            string `json:"id"`
	DoctorID      string `json:"doctor_id"`
	HospitalID    string `json:"hospital_id"`
	Day           string `json:"day"`
	ScheduleStart string `json:"schedule_start"`
	ScheduleEnd   string `json:"schedule_end"`
}
