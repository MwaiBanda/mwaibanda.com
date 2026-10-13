package article

import "context"

type Repository interface {
	GetAllArticles(ctx context.Context) ([]Article, error)
}
