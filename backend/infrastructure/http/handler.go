package http

import (
	articleService "MwaiBanda/backend/application/service/article"
	projectService "MwaiBanda/backend/application/service/project"
)

type Handler struct {
	articles articleService.UseCase
	projects projectService.UseCase
}

func GetInstance(articles articleService.UseCase, projects projectService.UseCase) *Handler {
	return &Handler{articles: articles, projects: projects}
}
