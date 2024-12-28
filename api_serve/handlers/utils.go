package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

func sanitizeResponse(rawResp string) (int, interface{}) {
	type response struct {
		Status   int         `json:"Status"`
		Response interface{} `json:"Response"`
	}
	var resp response
	err := json.Unmarshal([]byte(rawResp), &resp)
	if err != nil {
		// not a proper response, with traceback errors or print statements. better to send it raw with statuscode 503
		log.Printf("Error found: %v", err)
		v := make(map[string]interface{})
		v["verbose"] = rawResp
		return http.StatusServiceUnavailable, v
	}
	return resp.Status, resp.Response
}
