package dto

type CreateHospitalDTO struct {
	Name        string `json:"name"`
	Location    string `json:"location"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
}
