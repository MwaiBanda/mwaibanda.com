package project

import "context"

type Repository interface {
	GetAllProjects(context.Context) ([]Project, error)
}
