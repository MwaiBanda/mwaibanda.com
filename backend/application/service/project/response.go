package project

import (
	"encoding/json"

	"MwaiBanda/backend/domain/project"
)

type Response struct {
	ID          int      `json:"id"`
	Name        string   `json:"name"`
	StartDate   string   `json:"start_date"`
	EndDate     string   `json:"end_date"`
	Summary     string   `json:"summary"`
	Image       string   `json:"image"`
	Description string   `json:"description"`
	Link        string   `json:"link"`
	Tags        []string `json:"tags"`
}

func toResponse(projectEntity project.Project) (Response, error) {
	tags := []string{}
	if len(projectEntity.Tags) > 0 {
		if err := json.Unmarshal(projectEntity.Tags, &tags); err != nil {
			return Response{}, err
		}
	}
	return Response{
		ID:          projectEntity.ID,
		Name:        projectEntity.Name,
		StartDate:   projectEntity.StartDate,
		EndDate:     projectEntity.EndDate,
		Summary:     projectEntity.Summary,
		Image:       projectEntity.Image,
		Description: projectEntity.Description,
		Link:        projectEntity.Link,
		Tags:        tags,
	}, nil
}
