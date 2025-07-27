package main

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Project struct {
	Name        string      `json:"name"`
	Year        int      `json:"year"`
	Image       string   `json:"image"`
	Summary     string   `json:"summary"`
	Description string   `json:"description"`
	Link        string   `json:"link"`
	Tags        []string `json:"tags"`
}

func main() {
	e := echo.New()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	e.Static("/assets", "frontend/dist/assets")
	e.File("/", "frontend/dist/index.html")
	api := e.Group("/api")
	api.Use(middleware.CORS())
	v1 := api.Group("/v1")
	v1.GET("/work", func(c echo.Context) error {
		work := []Project{
			{
				Name:        "Momentum",
				Year:        2025,
				Image:       "https://user-images.githubusercontent.com/49708426/184556277-883616f3-9fda-4709-8194-16e3af673486.png",
				Summary:     "Open-source Multiplatform Payments & Video Streaming for Android, iOS & iPadOS with a Go backend use delivery content and stored user generated data",
				Description: "Built in Kotlin Multiplatform Mobile(KMM) w/ SwiftUI & Jetpack Compose, the app allows users to make payments to the church, streaming sermons, edit & update account information. Persists data locally w/ SQLDelight and Remote w/ Firebase. The app is architected to emphasize code sharing between Android, iOS & iPadOS, so all core business logic written in the SDK",
				Link:        "https://github.com/MwaiBanda/Momentum",
				Tags: []string{
					"KMM", "Jetpack Compose", "SwiftUI",
				},
			},
			{
				Name:        "Momentum",
				Year:        2025,
				Image:       "https://user-images.githubusercontent.com/49708426/184556277-883616f3-9fda-4709-8194-16e3af673486.png",
				Summary:     "Open-source Multiplatform Payments & Video Streaming for Android, iOS & iPadOS with a Go backend use delivery content and stored user generated data",
				Description: "Built in Kotlin Multiplatform Mobile(KMM) w/ SwiftUI & Jetpack Compose, the app allows users to make payments to the church, streaming sermons, edit & update account information. Persists data locally w/ SQLDelight and Remote w/ Firebase. The app is architected to emphasize code sharing between Android, iOS & iPadOS, so all core business logic written in the SDK",
				Link:        "https://github.com/MwaiBanda/Momentum",
				Tags: []string{
					"KMM", "Jetpack Compose", "SwiftUI",
				},
			},
			{
				Name:        "Momentum",
				Year:        2025,
				Image:       "https://user-images.githubusercontent.com/49708426/184556277-883616f3-9fda-4709-8194-16e3af673486.png",
				Summary:     "Open-source Multiplatform Payments & Video Streaming for Android, iOS & iPadOS with a Go backend use delivery content and stored user generated data",
				Description: "Built in Kotlin Multiplatform Mobile(KMM) w/ SwiftUI & Jetpack Compose, the app allows users to make payments to the church, streaming sermons, edit & update account information. Persists data locally w/ SQLDelight and Remote w/ Firebase. The app is architected to emphasize code sharing between Android, iOS & iPadOS, so all core business logic written in the SDK",
				Link:        "https://github.com/MwaiBanda/Momentum",
				Tags: []string{
					"KMM", "Jetpack Compose", "SwiftUI",
				},
			},
		}
		return c.JSON(http.StatusOK, work)
	})

	e.Logger.Fatal(e.Start("0.0.0.0:" + port))
}
