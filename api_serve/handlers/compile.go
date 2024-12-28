package handlers

import (
	"backpocket/api-serve/data"
	"backpocket/api-serve/engine"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CompileHandler(c *gin.Context) {
	var compileRequestBody struct {
		Code    string       `json:"code"`
		Payload data.Payload `json:"payload" binding:"required"`
	}
	err := c.ShouldBindBodyWithJSON(&compileRequestBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		panic(err)
	}
	then := time.Now()
	responseOut, responseErr := engine.Run(compileRequestBody.Code, &compileRequestBody.Payload)
	log.Printf("Time taken for execution: %s", time.Since(then))
	status, responseJson := sanitizeResponse(responseOut)
	c.JSON(status, gin.H{"response": responseJson, "errors": responseErr})
}
