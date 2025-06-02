package hospital

type HospitalRepository interface {
	Save(hospital *Hospital) error
	FindByID(id string) (*Hospital, error)
	GetAllHospitals(offset int, limit int) ([]*Hospital, int, error)
	DeleteByID(id string) error
}
