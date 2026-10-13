package article

import (
	"context"
)

func (s *Service) GetAllArticles(ctx context.Context) ([]Response, error) {
	articles, err := s.repository.GetAllArticles(ctx)
	if err != nil {
		return nil, err
	}
	response := make([]Response, len(articles))
	for i := range articles {
		articleResponse, err := toResponse(articles[i])
		if err != nil {
			return nil, err
		}
		response[i] = articleResponse
	}
	return response, nil
}
