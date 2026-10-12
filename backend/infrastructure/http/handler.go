package http

import (
	articleService "MwaiBanda/backend/application/service/article"
	projectService "MwaiBanda/backend/application/service/project"
)

type Handler struct {
	articles *articleService.Service
	projects *projectService.Service
}

func New(articles *articleService.Service, projects *projectService.Service) *Handler {
	return &Handler{articles: articles, projects: projects}
}
