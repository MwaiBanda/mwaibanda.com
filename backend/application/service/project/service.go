package project

import "MwaiBanda/backend/domain/project"

type Service struct {
	repository project.Repository
}

func New(repository project.Repository) *Service {
	return &Service{repository: repository}
}
