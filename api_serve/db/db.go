package db

import (
	"backpocket/api-serve/data"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func DB_Connect() {
	dbPath := "/db/private/db.sqlite3"

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

func GetEndpointInfo(endpoint string, method string) (int, string, data.ApiData, int) {
	query := "SELECT code,api_data,user_id FROM deploy_api WHERE endpoint=? AND method=?"
	var (
		code         string
		api_data_raw string
		user_id      int
	)
	rows, err := db.Query(query, endpoint, method)
	if err != nil {
		log.Print("Sql error", err)
		return 500, "", data.ApiData{}, user_id
	}
	i := 0
	for rows.Next() {
		err := rows.Scan(&code, &api_data_raw, &user_id)
		if err != nil {
			log.Print("Error while reading rows:", err)
			return 500, "", data.ApiData{}, user_id
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
		return 500, "", api_data, user_id
	}
	return 200, code, api_data, user_id
}

func GetTablesDict(user_id int) (int, map[string]string) {
	query := "SELECT table_name, table_uuid FROM deploy_table WHERE user_id=?"
	rows, err := db.Query(query, user_id)
	if err != nil {
		panic(err)
	}
	tableDict := make(map[string]string)
	for rows.Next() {
		var key, value string
		err := rows.Scan(&key, &value)
		if err != nil {
			log.Print(err)
			return 500, tableDict
		}
		tableDict[key] = fmt.Sprintf("table_%s_%s_%s_%s_%s", value[:8], value[8:12], value[12:16], value[16:20], value[20:32])
	}
	return 200, tableDict
}
