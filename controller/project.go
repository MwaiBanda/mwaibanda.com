package controller

import (
	"net/http"
	"github.com/labstack/echo/v4"
)

func (c *Controller) GetProjects(server echo.Context) error {
	projects, err := c.Client.Project.Query().All(c.Context)
	if err != nil {
		return err
	}
	return server.JSON(http.StatusOK, projects)

}