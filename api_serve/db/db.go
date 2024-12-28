package db

import (
	"backpocket/api-serve/data"
	"database/sql"
	"encoding/json"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func DB_Connect() {
	dbPath := "../db/private/db.sqlite3"

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

func DB_Disconnect() {
	db.Close()
}

func GetEndpointInfo(endpoint string, method string) (int, string, data.ApiData) {
	query := "SELECT code,api_data FROM deploy_api WHERE endpoint=? AND method=?"
	var code string
	var api_data_raw string
	rows, err := db.Query(query, endpoint, method)
	if err != nil {
		log.Print("Sql error", err)
		return 500, "", data.ApiData{}
	}
	i := 0
	for rows.Next() {
		err := rows.Scan(&code, &api_data_raw)
		if err != nil {
			log.Print("Error while reading rows:", err)
			return 500, "", data.ApiData{}
		}
		i += 1
	}
	if i != 1 {
		log.Print("No endpoints found")
	}
	var api_data data.ApiData
	err = json.Unmarshal([]byte(api_data_raw), &api_data)
	if err != nil {
		log.Print("Error unmarshalling json:", err)
		return 500, "", api_data
	}
	return 200, code, api_data
}
