package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

type CompileRequest struct {
	Code string `json:"code"`
}

/*
called from django script
request: code
response: output
*/
func compileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusBadGateway)
		return
	}
	body, err := io.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil || len(body) == 0 {
		http.Error(w, "No body to read", http.StatusBadRequest)
		return
	}
	log.Println("Body:", string(body))
	var requestBody CompileRequest

	err = json.Unmarshal(body, &requestBody)

	if err != nil {
		log.Println(err)
		panic(err)
	}
	log.Println(requestBody.Code)

}

/*
called by user directly
urlpattern: /api/<random_alphanum>
body: can be anything in json, will be passed to the python script
*/
func serve(w http.ResponseWriter, r *http.Request) {

}

func main() {
	http.HandleFunc("/compile", compileHandler)
	// http.HandleFunc("/api/")
	http.ListenAndServe(":8080", nil)
}
