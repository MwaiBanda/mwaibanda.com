package project

type Project struct {
	ID          int    `db:"id"`
	Name        string `db:"name"`
	StartDate   string `db:"start_date"`
	EndDate     string `db:"end_date"`
	Summary     string `db:"summary"`
	Image       string `db:"image"`
	Description string `db:"description"`
	Link        string `db:"link"`
	Tags        []byte `db:"tags"`
}
