package handlers

import (
	"backpocket/api-serve/data"
	"backpocket/api-serve/db"
	"backpocket/api-serve/engine"
	"log"
	"net/http"
	"sync/atomic"
	"time"

	"github.com/gin-gonic/gin"
)

func CompileHandler(c *gin.Context) {
	atomic.AddUint32(&data.RequestID, 1)

	var compileRequestBody struct {
		Code    string       `json:"code"`
		Payload data.Payload `json:"payload" binding:"required"`
		UserId  int          `json:"user_id" binding:"required"`
	}
	err := c.ShouldBindBodyWithJSON(&compileRequestBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		panic(err)
	}
	then := time.Now()
	var (
		tableDict map[string]string
		status    int
	)

	handle := engine.GetHandle()
	status, tableDict = db.GetTablesDict(compileRequestBody.UserId)
	if status == 200 {
		file := getDictFile(tableDict)
		handle.CopyScriptToContainer(&file, engine.ContainerID)
	} else {
		c.JSON(status, gin.H{"message": "Couldn't find table list"})
		return
	}

	responseOut, responseErr := handle.Run(compileRequestBody.Code, &compileRequestBody.Payload)
	handle.Channel <- true
	log.Printf("Time taken for execution: %s", time.Since(then))
	status, responseJson := sanitizeResponse(responseOut)
	c.JSON(status, gin.H{"response": responseJson, "errors": responseErr})
}
