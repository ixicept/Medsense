package auth

type AccountRepository interface {
	CreateAccount(email, password string) (string, error)
	FindByEmail(email string) (string, error)
	FindByID(id string) (string, error)
}
