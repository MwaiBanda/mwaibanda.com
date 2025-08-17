package model


type Project struct {
	Name        string   `json:"name"`
	StartDate   string   `json:"startDate"`
	EndDate     string   `json:"endDate"`
	Image       string   `json:"image"`
	Summary     string   `json:"summary"`
	Description string   `json:"description"`
	Link        string   `json:"link"`
	Tags        []string `json:"tags"`
}
