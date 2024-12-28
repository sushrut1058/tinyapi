package handlers

import (
	"backpocket/api-serve/data"
	"backpocket/api-serve/db"
	"backpocket/api-serve/engine"
	"encoding/json"
	"log"
	"strings"

	"github.com/gin-gonic/gin"
)

func ApiServe(c *gin.Context) {
	endpoint := c.Param("random")

	//method
	method := c.Request.Method

	//query params
	queryParams_raw := c.Request.URL.Query()
	var queryParams map[string]any
	for query, values := range queryParams_raw {
		queryParams[query] = values[0]
	}

	//headers
	headers := make(map[string]interface{})
	headers["Content-Type"] = "application/json"
	for key, value := range c.Request.Header {
		headers[key] = value[0]
	}

	// check with db for existence
	status, code, api_data := db.GetEndpointInfo(endpoint, method)
	if status != 200 {
		c.JSON(status, gin.H{"message": "The endpoint you're trying to access doesn't exist"})
		return
	}

	//make pathparams map[string]interface{}
	pathParams := make(map[string]string)
	pathParamKeys := api_data.PathParams
	pathParamValues_raw := c.Param("params")
	var pathParamValues []string
	if len(pathParamValues_raw) > 0 {
		pathParamValues = strings.Split(pathParamValues_raw[1:], "/")
	}
	for i := range pathParamKeys {
		if i == len(pathParamValues) {
			break
		}
		pathParams[pathParamKeys[i]] = pathParamValues[i]
	}

	//body parsing
	var bodyJson map[string]interface{}
	var err error
	content_type := api_data.ContentType

	if content_type != c.GetHeader("Content-Type") {
		content_type = "plain/text"
	}
	if content_type == "application/json" {
		//check if request body is valid json
		err = c.ShouldBindJSON(&bodyJson)
	} else if content_type == "application/x-www-form-urlencoded" {
		//extract body and create json then strign out of it
		err = c.ShouldBind(&bodyJson)
	}
	if err != nil {
		c.JSON(400, gin.H{"message": "Invalid payload provided"})
		return
	}
	bodyStr, err := json.Marshal(bodyJson)

	payload := &data.Payload{
		QueryParams: queryParams,
		PathParams:  pathParams,
		Method:      method,
		Request: data.Request{
			Body:    string(bodyStr),
			Headers: headers,
		},
	}
	//fetch and engine.run() with payload
	responseOut, responseErr := engine.Run(code, payload)
	log.Print(responseErr)
	status, responseJson := sanitizeResponse(responseOut)
	//forward output
	c.JSON(status, responseJson)
}
