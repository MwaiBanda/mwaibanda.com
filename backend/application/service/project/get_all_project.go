package project

import (
	"context"
)

func (s *Service) GetAllProjects(ctx context.Context) ([]Response, error) {
	projects, err := s.repository.GetAllProjects(ctx)
	if err != nil {
		return nil, err
	}
	var response = make([]Response, len(projects))
	for i, p := range projects {
		projectResponse, err := toResponse(p)
		if err != nil {
			return nil, err
		}
		response[i] = projectResponse
	}
	return response, nil
}
