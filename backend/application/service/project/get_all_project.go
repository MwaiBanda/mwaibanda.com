package project

import (
	"context"

	"MwaiBanda/backend/domain/project"
)

func (s *Service) GetAllProjects(ctx context.Context) ([]project.ProjectResponse, error) {
	projects, err := s.repository.GetAllProjects(ctx)
	if err != nil {
		return nil, err
	}
	var response = make([]project.ProjectResponse, len(projects))
	for i, p := range projects {
		response[i] = *p.ToResponse()
	}
	return response, nil
}
