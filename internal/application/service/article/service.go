package article

import "MwaiBanda/internal/domain/article"

type Service struct {
	repository article.Repository
}

func New(repository article.Repository) *Service {
	return &Service{repository: repository}
}
