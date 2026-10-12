package http

import (
	"log/slog"
	"net/http"

	"github.com/labstack/echo/v4"
)

func (h *Handler) GetProjects(server echo.Context) error {
	projects, err := h.projects.GetAllProjects(server.Request().Context())
	if err != nil {
		slog.Error("failed getting projects", "error", err)
		return server.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to fetch projects"})
	}
	return server.JSON(http.StatusOK, projects)

}
