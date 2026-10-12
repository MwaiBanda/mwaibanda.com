package article

import "MwaiBanda/backend/domain/article"

type Service struct {
	repository article.Repository
}

func GetInstance(repository article.Repository) *Service {
	return &Service{repository: repository}
}
