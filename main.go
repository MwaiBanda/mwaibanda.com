package main

import (
	"os"
	"MwaiBanda/controller"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	server := echo.New()
	controller := controller.GetInstance()
	defer controller.CleanUp()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	server.Static("/assets", "frontend/dist/assets")
	server.File("/resume.pdf", "frontend/dist/resume.pdf") 
	server.File("/", "frontend/dist/index.html")
	server.File("/portfolio", "frontend/dist/index.html")
	server.File("/blog/:article", "frontend/dist/index.html")

	api := server.Group("/api")
	api.Use(middleware.CORS())

	v1 := api.Group("/v1")
	v1.GET("/work", controller.GetProjects)
	v1.GET("/articles", controller.GetArticles)

	server.Logger.Fatal(server.Start("0.0.0.0:" + port))
}
