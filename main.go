package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	err := godotenv.Load()
	if err != nil {
		log.Fatalln("Error loading .env file")
	}
	

	port := func() string {
		if len(os.Getenv("PORT")) > 0 {
			return os.Getenv("PORT")
		} else {
			return "8080"
		}
	}()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.Logger.Fatal(e.Start(":" + port))
}