package auth

type DoctorRegistrationRepository interface {
	Save(registration DoctorRegistration) error
	FindByID(id RegistrationID) (DoctorRegistration, error)
	FindByEmail(email string) (DoctorRegistration, error)
	FindPending(offset int, limit int) (registrations []DoctorRegistration, totalCount int, err error)
}
