package article

import (
	"context"

	"MwaiBanda/backend/domain/article"
	"MwaiBanda/backend/infrastructure/persistence"
)

func (r *Repository) GetAllArticles(ctx context.Context) ([]article.Article, error) {
	query := persistence.LoadFile("repository/article/sql/get_all_articles.sql")
	articles := []article.Article{}
	err := r.db.SelectContext(ctx, &articles, query)
	if err != nil {
		return nil, err
	}
	return articles, nil
}
