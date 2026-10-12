package article

import "context"

type Repository interface {
	GetAllArticles(context.Context) ([]Article, error)
}
