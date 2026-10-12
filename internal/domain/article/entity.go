package article

import "encoding/json"

type Article struct {
	ID    int
	Name  string
	Image string
	Summary string
	Body  string
	PublicationDate string `db:"publication_date"`
	Tags  []byte
}

type ArticleResponse struct {
	ID    int `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
	Summary string `json:"summary"`
	Body  string `json:"body"`
	PublicationDate string `json:"publication_date"`
	Tags  []string `json:"tags"`
}

func (a *Article) ToResponse() ArticleResponse {
	tags := []string{}
	if len(a.Tags) > 0 {
		_ = json.Unmarshal(a.Tags, &tags)
	}
	return ArticleResponse{
		ID:              a.ID,
		Name:            a.Name,
		Image:           a.Image,
		Summary:         a.Summary,
		Body:            a.Body,
		PublicationDate: a.PublicationDate,
		Tags:            tags,
	}
}