package dto

type CreateAppointmentDTO struct {
	ID            string `json:"id"`
	PatientID     string `json:"patient_id"`
	DoctorID      string `json:"doctor_id"`
	RequestedTime string `json:"requested_time"`
	Reason        string `json:"reason"`
}
