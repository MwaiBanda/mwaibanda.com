package article

import (
	"context"

	"MwaiBanda/backend/domain/article"
)

type UseCase interface {
	GetAllArticles(ctx context.Context) ([]Response, error)
}

type Service struct {
	repository article.Repository
}

func GetInstance(repository article.Repository) *Service {
	return &Service{repository: repository}
}
