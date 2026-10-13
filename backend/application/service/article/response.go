package article

import (
	"encoding/json"

	"MwaiBanda/backend/domain/article"
)

type Response struct {
	ID              int      `json:"id"`
	Name            string   `json:"name"`
	Image           string   `json:"image"`
	Summary         string   `json:"summary"`
	Body            string   `json:"body"`
	PublicationDate string   `json:"publication_date"`
	Tags            []string `json:"tags"`
}

func toResponse(articleEntity article.Article) (Response, error) {
	tags := []string{}
	if len(articleEntity.Tags) > 0 {
		if err := json.Unmarshal(articleEntity.Tags, &tags); err != nil {
			return Response{}, err
		}
	}
	return Response{
		ID:              articleEntity.ID,
		Name:            articleEntity.Name,
		Image:           articleEntity.Image,
		Summary:         articleEntity.Summary,
		Body:            articleEntity.Body,
		PublicationDate: articleEntity.PublicationDate,
		Tags:            tags,
	}, nil
}
