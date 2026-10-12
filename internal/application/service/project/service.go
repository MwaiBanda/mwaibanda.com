package project

import "MwaiBanda/internal/domain/project"

type Service struct {
	repository project.Repository
}

func New(repository project.Repository) *Service {
	return &Service{repository: repository}
}
