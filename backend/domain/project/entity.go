package project

import "encoding/json"

type Project struct {
	ID    int `db:"id"`
	Name  string `db:"name"`
	StartDate  string `db:"start_date"`
	EndDate string `db:"end_date"`
	Summary string `db:"summary"`
	Image string `db:"image"`
	Description string `db:"description"`
	Link string `db:"link"`
	Tags []byte `db:"tags"`
}

type ProjectResponse struct {
	ID    int
	Name  string `json:"name"`
	StartDate  string `json:"start_date"`
	EndDate string `json:"end_date"`
	Summary string `json:"summary"`
	Image string `json:"image"`
	Description string `json:"description"`
	Link string `json:"link"`
	Tags []string `json:"tags"`
}

func (p *Project) ToResponse() *ProjectResponse {
	tags := []string{}
	if len(p.Tags) > 0 {
		_ = json.Unmarshal(p.Tags, &tags)
	}
	return &ProjectResponse{
		ID:          p.ID,
		Name:        p.Name,
		StartDate:   p.StartDate,
		EndDate:     p.EndDate,
		Summary:     p.Summary,
		Image:       p.Image,
		Description: p.Description,
		Link:        p.Link,
		Tags:        tags,
	}
}