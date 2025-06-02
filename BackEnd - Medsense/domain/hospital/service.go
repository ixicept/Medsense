package hospital

import "main/application/dto"

type Service interface {
	Save(req dto.CreateHospitalDTO) error
	GetAllHospitals(offset int, limit int) ([]*Hospital, int, error)
	FindByID(id string) (*Hospital, error)
	DeleteByID(id string) error
}
