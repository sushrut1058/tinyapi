package handlers

import (
	"backpocket/api-serve/data"
	"backpocket/api-serve/db"
	"backpocket/api-serve/engine"
	"encoding/json"
	"log"
	"strings"
	"sync/atomic"

	"github.com/gin-gonic/gin"
)

func ApiServe(c *gin.Context) {
	atomic.AddUint32(&data.RequestID, 1)

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

	ch := make(chan bool, 1)

	// check with db for existence
	var (
		status   int
		code     string
		api_data data.ApiData
		user_id  int
	)
	status, code, api_data, user_id = db.GetEndpointInfo(endpoint, method)
	if status != 200 {
		ch <- false
		c.JSON(status, gin.H{"message": "The endpoint you're trying to access doesn't exist"})
		return
	}
	handle := engine.GetHandle()
	var tableDict map[string]string
	go func() {
		retVal := false
		status, tableDict = db.GetTablesDict(user_id)
		if status == 200 {
			file := getDictFile(tableDict)
			handle.CopyScriptToContainer(&file, engine.ContainerID)
			retVal = true
		} else {
			c.JSON(status, gin.H{"message": "Couldn't find table list"})
		}
		ch <- retVal
	}()

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
	retVal := <-ch
	if !retVal {
		log.Print("TableDict copying failed")
	}
	//fetch and engine.run() with payload
	responseOut, responseErr := handle.Run(code, payload)
	handle.Channel <- true
	log.Print(responseErr)
	status, responseJson := sanitizeResponse(responseOut)
	//forward output
	c.JSON(status, responseJson)
}
