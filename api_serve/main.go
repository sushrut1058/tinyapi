package main

import (
	"backpocket/api-serve/data"
	"backpocket/api-serve/db"
	"backpocket/api-serve/engine"
	"backpocket/api-serve/handlers"

	gin "github.com/gin-gonic/gin"
)

func main() {
	db.DB_Connect()
	defer db.DB_Disconnect()

	data.RequestID = 0
	engineHandle := engine.EngineHandle{RequestId: 0, ContainerID: "", Channel: make(chan bool, 1)}
	engineHandle.Channel <- true
	engine.SetHandle(&engineHandle)
	engineHandle.Start()
	defer engineHandle.Stop()

	r := gin.Default()
	r.RedirectTrailingSlash = false
	r.POST("/compile", handlers.CompileHandler)
	r.Any("/api/:random/*params", handlers.ApiServe)
	r.Any("/api/:random", handlers.ApiServe)
	r.Run()

}
