package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"snaplet/api_serve/data"
	"snaplet/api_serve/engine"

	gin "github.com/gin-gonic/gin"
)

type CompileResponse struct {
	Response string `json:"response"`
}

/*
called from django script
request: code
response: output
*/
func compileHandler(c *gin.Context) {
	var compileRequestBody struct {
		Code    string `json:"code" binding:"required"`
		Payload string `json:"payload" binding:"required"`
	}
	err := c.ShouldBindBodyWithJSON(&compileRequestBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}
	then := time.Now()
	payload := data.Payload{}
	response := engine.Run(compileRequestBody.Code, &payload)
	log.Printf("Time taken for execution: %s", time.Since(then))
	c.JSON(200, gin.H{"message": response})
}

func apiServe(c *gin.Context) {
	endpoint := c.Param("random")
	pathParams := c.Param("params")
	queryParams := c.Request.URL.Query()
	method := c.Request.Method
	headers := make(map[string]interface{})

	for key, value := range c.Request.Header {
		headers[key] = value
	}
	//1.check with db for existence
	status, code, content_type := GetEndpointInfo(endpoint, method)
	if status != 200 {
		c.JSON(status, gin.H{"message": "The endpoint you're trying to access doesn't exist"})
		return
	}
	log.Print(c.GetHeader("Content-Type"))
	if content_type != c.GetHeader("Content-Type") {
		content_type = "plain/text"
	}
	var jsonData map[string]interface{}
	var err error
	if content_type == "application/json" {
		//check if request body is valid json
		err = c.ShouldBindJSON(&jsonData)

	} else if content_type == "application/x-www-form-urlencoded" {
		//extract body and create json then strign out of it
		err = c.ShouldBind(&jsonData)
	}
	if err != nil {
		c.JSON(400, gin.H{"message": "Invalid payload provided"})
	}
	jsonStr, err := json.Marshal(jsonData)
	log.Printf("jsonStr: %v, pathParams: %v, queryParams: %v ", jsonStr, pathParams, queryParams)
	log.Print(queryParams["dfs"])

	payload := &data.Payload{
		QueryParams: queryParams,
		PathParams:  pathParams,
		Method:      method,
		Request: data.Request{
			Body:   string(jsonStr),
			Header: headers,
		},
	}
	fmt.Printf("Payload: %v", payload)
	fmt.Println(code)

	//2.fetch and engine.run() with payload (queryparams, body, header)
	response := engine.Run(code, payload)

	//forward output
	c.JSON(status, gin.H{"message": response})

}

func main() {
	DBConnect()
	engine.Start()
	defer engine.Stop()
	defer DBDisconnect()
	r := gin.Default()
	r.POST("/compile", compileHandler)
	r.Any("/api/:random/*params", apiServe)
	r.Run()

}
