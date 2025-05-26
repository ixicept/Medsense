package main

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	host     = "localhost"
	port     = 5432
	username = "postgres"  //ini user db kalian
	password = "philip168" //ini password db kalian
	dbname   = "Medsense" //ini nama db kalian
)

func ConnectionDatabase() *gorm.DB {
	sqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s", host, port, username, password, dbname)
	database, err := gorm.Open(postgres.Open(sqlInfo), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	return database
}
