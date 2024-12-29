package handlers

import (
	"backpocket/api-serve/data"
	"encoding/json"
	"fmt"
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

func getDictFile(dict map[string]string) data.File {
	elements := ""
	for key, value := range dict {
		elements += fmt.Sprintf(`"%v" : "%v" ,`, key, value)
	}
	out := fmt.Sprintf("table_dict = {%v}", elements)
	file := data.File{
		Name: "table_dict.py",
		Data: []byte(out),
		Dest: "/app/package/",
	}
	return file
}
