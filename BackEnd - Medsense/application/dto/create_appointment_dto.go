package dto

type CreateAppointmentDTO struct {
	PatientID     string `json:"patient_id"`
	DoctorID      string `json:"doctor_id"`
	RequestedTime string `json:"requested_time"`
	Reason        string `json:"reason"`
}
