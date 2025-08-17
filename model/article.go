package model

type Article struct {
	Name            string   `json:"name"`
	PublicationDate string   `json:"publicationDate"`
	Image           string   `json:"image"`
	Summary         string   `json:"summary"`
	Body            string   `json:"body"`
	Tags            []string `json:"tags"`
}