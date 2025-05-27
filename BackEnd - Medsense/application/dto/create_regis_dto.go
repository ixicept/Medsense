package dto

type CreateRegistrationDTO struct {
	Username       string `json:"username"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	PhoneNumber    string `json:"phone_number"`
	DateOfBirth    string `json:"date_of_birth"`
	FileAttachment []byte `json:"file_attachment"`
}
