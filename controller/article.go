package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (c *Controller) GetArticles(server echo.Context) error {
	articles, err := c.Client.Article.Query().All(c.Context)
	if err != nil {
		return err
	}
	return server.JSON(http.StatusOK, articles)
}