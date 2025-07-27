package main

import (
	"os"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	e.Static("/assets", "frontend/dist/assets")
	e.File("/", "frontend/dist/index.html")


	e.Logger.Fatal(e.Start("0.0.0.0:" + port))
}