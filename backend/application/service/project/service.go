package project

import (
	"context"

	"MwaiBanda/backend/domain/project"
)

type UseCase interface {
	GetAllProjects(ctx context.Context) ([]Response, error)
}

type Service struct {
	repository project.Repository
}

func GetInstance(repository project.Repository) *Service {
	return &Service{repository: repository}
}
