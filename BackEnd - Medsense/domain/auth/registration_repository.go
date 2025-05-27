package auth

type DoctorRegistrationRepository interface {
	CreateRegistration(registration DoctorRegistration) error
	FindByID(id string) (DoctorRegistration, error)
	FindByEmail(email string) (DoctorRegistration, error)
	FindPending(offset int, limit int) (registrations []DoctorRegistration, totalCount int, err error)
}
