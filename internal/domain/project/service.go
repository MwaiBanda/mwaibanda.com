package project

type Service interface {
	GetAllProjects() ([]ProjectResponse, error)
}