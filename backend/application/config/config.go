package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	TursoDatabaseURL   string
	TursoDatabaseToken string
	Port               string
}

func LoadConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil && os.Getenv("ENV") == "DEV" {
		return nil, fmt.Errorf("load .env file: %w", err)
	}
	configuration := &Config{
		TursoDatabaseURL:   os.Getenv("TURSO_DATABASE_URL"),
		TursoDatabaseToken: os.Getenv("TURSO_AUTH_TOKEN"),
		Port:               os.Getenv("PORT"),
	}
	if configuration.Port == "" {
		configuration.Port = "8080"
	}
	port, err := strconv.Atoi(configuration.Port)
	if err != nil || port < 1 || port > 65535 {
		return nil, fmt.Errorf("PORT must be an integer between 1 and 65535")
	}
	if configuration.TursoDatabaseURL == "" || configuration.TursoDatabaseToken == "" {
		return nil, fmt.Errorf("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required")
	}
	return configuration, nil
}
