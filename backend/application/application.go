package application

import (
	"MwaiBanda/backend/application/config"
	articleService "MwaiBanda/backend/application/service/article"
	projectService "MwaiBanda/backend/application/service/project"
	transport "MwaiBanda/backend/infrastructure/http"
	articleRepository "MwaiBanda/backend/infrastructure/persistence/repository/article"
	projectRepository "MwaiBanda/backend/infrastructure/persistence/repository/project"
	"context"
	"errors"
	"fmt"
	"net"
	"net/http"
	"os"
	"time"

	"MwaiBanda/backend/infrastructure/persistence/db"

	"github.com/labstack/echo/v4"
)

const shutdownTimeout = 5 * time.Second

type Application struct {
	echo     *echo.Echo
	database *db.Instance
}

func New(ctx context.Context) (*Application, error) {
	if err := ctx.Err(); err != nil {
		return nil, fmt.Errorf("startup canceled: %w", err)
	}
	configuration, err := config.LoadConfig()
	if err != nil {
		return nil, fmt.Errorf("load configuration: %w", err)
	}
	if err := ctx.Err(); err != nil {
		return nil, fmt.Errorf("startup canceled: %w", err)
	}
	database, err := db.GetDatabaseInstance(ctx, configuration)
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}
	if err := database.Migrate(ctx); err != nil {
		return nil, closeAfterStartupFailure(database, fmt.Errorf("run database migrations: %w", err))
	}
	if err := ctx.Err(); err != nil {
		return nil, closeAfterStartupFailure(database, fmt.Errorf("startup canceled: %w", err))
	}

	articles := articleService.GetInstance(articleRepository.GetInstance(database.DB))
	projects := projectService.GetInstance(projectRepository.GetInstance(database.DB))
	handler := transport.GetInstance(articles, projects)
	echoServer, err := transport.NewServer(handler, "frontend/dist", os.Getenv("RELEASE_SHA"))
	if err != nil {
		return nil, closeAfterStartupFailure(database, fmt.Errorf("configure HTTP server: %w", err))
	}

	echoServer.Server = &http.Server{
		Addr:              "0.0.0.0:" + configuration.Port,
		Handler:           echoServer,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	return &Application{
		echo:     echoServer,
		database: database,
	}, nil
}

func closeAfterStartupFailure(resource interface{ Close() error }, startupErr error) error {
	if closeErr := resource.Close(); closeErr != nil {
		return errors.Join(startupErr, fmt.Errorf("close database after startup failure: %w", closeErr))
	}
	return startupErr
}

func (a *Application) Run(ctx context.Context) error {
	listener, err := (&net.ListenConfig{}).Listen(ctx, "tcp", a.echo.Server.Addr)
	if err != nil {
		return fmt.Errorf("listen HTTP server: %w", err)
	}
	a.echo.Listener = listener
	return a.serve(ctx)
}

func (a *Application) serve(ctx context.Context) error {
	serverErrors := make(chan error, 1)
	go func() {
		serverErrors <- a.echo.StartServer(a.echo.Server)
	}()

	select {
	case err := <-serverErrors:
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			return fmt.Errorf("HTTP server stopped unexpectedly: %w", err)
		}
		return nil
	case <-ctx.Done():
		shutdown, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
		defer cancel()

		shutdownErr := a.echo.Server.Shutdown(shutdown)
		if shutdownErr != nil {
			if closeErr := a.echo.Server.Close(); closeErr != nil {
				shutdownErr = errors.Join(shutdownErr, fmt.Errorf("force-close HTTP server: %w", closeErr))
			}
		}
		serverErr := <-serverErrors
		if errors.Is(serverErr, http.ErrServerClosed) {
			serverErr = nil
		} else if serverErr != nil {
			serverErr = fmt.Errorf("HTTP server stopped unexpectedly: %w", serverErr)
		}
		if shutdownErr != nil {
			return errors.Join(fmt.Errorf("shut down HTTP server: %w", shutdownErr), serverErr)
		}
		return serverErr
	}
}

func (a *Application) Close() error {
	if a == nil || a.database == nil {
		return nil
	}
	if err := a.database.Close(); err != nil {
		return fmt.Errorf("close database: %w", err)
	}
	return nil
}
