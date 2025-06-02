package auth

type AccountRepository interface {
	CreateAccount(Account) (string, error)
	FindByEmail(email string) (Account, error)
	FindByID(id string) (Account, error)
	FindByRole(role string, offset int, limit int) (accounts []Account, totalCount int, err error)
	FindByDoctorID(doctorID string) (Account, error)
}
