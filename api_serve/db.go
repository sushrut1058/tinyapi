package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func DBConnect() {
	dbPath := "../db/db.sqlite3"

	// Check if the database file exists
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		log.Fatalf("Database file not found at %s", dbPath)
	}
	// Open connection to SQLite database
	var err error
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	if err = db.Ping(); err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	log.Print("Successfully connected to the SQLite database!")
}

func DBDisconnect() {
	db.Close()
}

func GetEndpointInfo(endpoint string, method string) (int, string, string) {
	query := "SELECT code,content_type FROM deploy_api WHERE endpoint=? AND method=?"
	var code string
	var content_type string
	rows, err := db.Query(query, endpoint, method)
	if err != nil {
		log.Print("Sql error", err)
	}
	i := 0
	for rows.Next() {
		err := rows.Scan(&code, &content_type)
		if err != nil {
			log.Print("Error while reading rows:", err)
			return 500, "", ""
		}
		i += 1
	}
	if i != 1 {
		log.Print("No endpoints found")
	}
	return 200, code, content_type
}
