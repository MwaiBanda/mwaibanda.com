package article

type Article struct {
	ID              int
	Name            string
	Image           string
	Summary         string
	Body            string
	PublicationDate string `db:"publication_date"`
	Tags            []byte
}
