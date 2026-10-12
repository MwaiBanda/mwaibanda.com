package http

import (
	"log/slog"
	"net/http"

	"github.com/labstack/echo/v4"
)

func (h *Handler) GetArticles(server echo.Context) error {
	articles, err := h.articles.GetAllArticles(server.Request().Context())
	if err != nil {
		slog.Error("failed getting articles", "error", err)
		return server.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to fetch articles"})
	}
	return server.JSON(http.StatusOK, articles)
}
