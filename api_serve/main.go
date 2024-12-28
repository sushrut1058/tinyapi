package main

import (
	"backpocket/api-serve/db"
	"backpocket/api-serve/engine"
	"backpocket/api-serve/handlers"

	gin "github.com/gin-gonic/gin"
)

func main() {

	db.DB_Connect()
	engine.Start()
	defer engine.Stop()
	defer db.DB_Disconnect()
	r := gin.Default()
	r.RedirectTrailingSlash = false

	r.POST("/compile", handlers.CompileHandler)
	r.Any("/api/:random/*params", handlers.ApiServe)
	r.Any("/api/:random", handlers.ApiServe)
	r.Run()

}
