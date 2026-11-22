package main

import (
	"context"
	"errors"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"MwaiBanda/backend/application"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	startupCtx, cancel := context.WithTimeout(ctx, 2 * time.Minute)
	defer cancel()

	app, err := application.New(startupCtx)
	if err != nil {
		slog.Error("application creation failed", "error", err)
		os.Exit(1)
	}
	defer func() {
		err = errors.Join(err, app.Close())
	}()

	if err := app.Run(ctx); err != nil {
		slog.Error("application run failed", "error", err)
		os.Exit(1)
	}
}
