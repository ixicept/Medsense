package hospital

import (
	"main/application/dto"
	"time"

	"github.com/google/uuid"
)

type Hospital struct {
	ID          string
	Name        string
	Location    string
	Description string
	ImageURL    string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func NewHospital(req dto.CreateHospitalDTO) (*Hospital, error) {

	now := time.Now().UTC()
	return &Hospital{
		ID:          uuid.NewString(),
		Name:        req.Name,
		Location:    req.Location,
		Description: req.Description,
		ImageURL:    req.ImageURL,
		CreatedAt:   now,
		UpdatedAt:   now,
	}, nil
}
