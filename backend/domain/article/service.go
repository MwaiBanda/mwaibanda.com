package article

type Service interface {
	GetAllArticles() ([]ArticleResponse, error)
}