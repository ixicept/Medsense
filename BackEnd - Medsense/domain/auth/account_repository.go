package auth

type AccountRepository interface {
	CreateAccount(Account) (string, error)
	FindByEmail(email string) (Account, error)
	FindByID(id string) (Account, error)
}
