package project

import "context"

type Repository interface {
	GetAllProjects(ctx context.Context) ([]Project, error)
}
