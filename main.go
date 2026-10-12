package main

import (
	"MwaiBanda/backend/application/config"
	articleService "MwaiBanda/backend/application/service/article"
	projectService "MwaiBanda/backend/application/service/project"
	transport "MwaiBanda/backend/infrastructure/http"
	articleRepository "MwaiBanda/backend/infrastructure/persistence/repository/article"
	projectRepository "MwaiBanda/backend/infrastructure/persistence/repository/project"
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"MwaiBanda/backend/infrastructure/persistence/db"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	server := echo.New()
	configuration, err := config.LoadConfig()
	if err != nil {
		slog.Error("failed loading configuration", "error", err)
		os.Exit(1)
	}
	database, err := db.GetDatabaseInstance(configuration)
	if err != nil {
		slog.Error("failed opening database", "error", err)
		os.Exit(1)
	}
	defer func() {
		if err := database.Close(); err != nil {
			slog.Error("failed closing database", "error", err)
		}
	}()
	if err := database.Migrate(); err != nil {
		slog.Error("failed running database migrations", "error", err)
		os.Exit(1)
	}
	articles := articleService.New(articleRepository.GetInstance(database.DB))
	projects := projectService.New(projectRepository.GetInstance(database.DB))
	handler := transport.New(articles, projects)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	server.Static("/assets", "frontend/dist/assets")
	server.File("/resume.pdf", "frontend/dist/resume.pdf")
	server.File("/", "frontend/dist/index.html")
	server.File("/portfolio", "frontend/dist/index.html")
	server.File("/blog/:article", "frontend/dist/index.html")

	server.RouteNotFound("/*", func(c echo.Context) error {
		return c.File("frontend/dist/index.html")
	})

	api := server.Group("/api")
	api.Use(middleware.CORS())

	v1 := api.Group("/v1")
	v1.GET("/work", handler.GetProjects)
	v1.GET("/articles", handler.GetArticles)

	shutdownContext, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	serverErrors := make(chan error, 1)
	go func() {
		serverErrors <- server.Start("0.0.0.0:" + port)
	}()
	select {
	case err := <-serverErrors:
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server stopped unexpectedly", "error", err)
			os.Exit(1)
		}
	case <-shutdownContext.Done():
		shutdown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdown); err != nil {
			slog.Error("failed shutting down server", "error", err)
		}
		if err := <-serverErrors; err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server stopped unexpectedly", "error", err)
		}
	}
}
