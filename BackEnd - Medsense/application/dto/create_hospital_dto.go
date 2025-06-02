package dto

type CreateHospitalDTO struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Location    string `json:"location"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
}
