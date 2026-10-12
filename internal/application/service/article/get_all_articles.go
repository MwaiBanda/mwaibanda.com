package article

import (
	"context"

	"MwaiBanda/internal/domain/article"
)

func (s *Service) GetAllArticles(ctx context.Context) ([]article.ArticleResponse, error) {
	articles, err := s.repository.GetAllArticles(ctx)
	if err != nil {
		return nil, err
	}
	response := make([]article.ArticleResponse, len(articles))
	for i := range articles {
		response[i] = articles[i].ToResponse()
	}
	return response, nil
}
