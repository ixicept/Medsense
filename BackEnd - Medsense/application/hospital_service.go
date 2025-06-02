package application

import (
	"main/application/dto"
	"main/domain/hospital"

	"github.com/go-playground/validator/v10"
)

type HospitalService struct {
	hospitalRepository hospital.HospitalRepository
	validate           *validator.Validate
}

func NewHospitalService(hospitalRepository hospital.HospitalRepository, validate *validator.Validate) hospital.Service {
	return &HospitalService{
		hospitalRepository: hospitalRepository,
		validate:           validate,
	}
}

func (s *HospitalService) Save(req dto.CreateHospitalDTO) error {
	if err := s.validate.Struct(req); err != nil {
		return err // Validation error
	}

	hospitalEntity, err := hospital.NewHospital(req)
	if err != nil {
		return err
	}

	return s.hospitalRepository.Save(hospitalEntity)
}

func (s *HospitalService) FindByID(id string) (*hospital.Hospital, error) {
	hospitalEntity, err := s.hospitalRepository.FindByID(id)
	if err != nil {
		return nil, err
	}
	return hospitalEntity, nil
}

func (s *HospitalService) GetAllHospitals(offset int, limit int) ([]*hospital.Hospital, int, error) {
	hospitals, totalCount, err := s.hospitalRepository.GetAllHospitals(offset, limit)
	if err != nil {
		return nil, 0, err // Error from repository
	}

	return hospitals, totalCount, nil
}
