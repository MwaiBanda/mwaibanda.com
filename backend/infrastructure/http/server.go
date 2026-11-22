package http

import (
	"fmt"
	"path/filepath"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const contentSecurityPolicy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"

func NewServer(handler *Handler, staticRoot, releaseSHA string) (*echo.Echo, error) {
	server := echo.New()
	server.Use(releaseMetadata(releaseSHA))
	server.Use(middleware.SecureWithConfig(middleware.SecureConfig{
		XFrameOptions:         "DENY",
		ReferrerPolicy:        "strict-origin-when-cross-origin",
		ContentSecurityPolicy: contentSecurityPolicy,
	}))

	server.Static("/assets", filepath.Join(staticRoot, "assets"))
	server.File("/resume.pdf", filepath.Join(staticRoot, "resume.pdf"))
	if err := RegisterPublicPages(server, staticRoot); err != nil {
		return nil, fmt.Errorf("register public pages: %w", err)
	}
	server.RouteNotFound("/*", func(c echo.Context) error {
		return c.File(filepath.Join(staticRoot, "index.html"))
	})

	api := server.Group("/api")
	v1 := api.Group("/v1")
	v1.GET("/work", handler.GetProjects)
	v1.GET("/articles", handler.GetArticles)
	api.RouteNotFound("", echo.NotFoundHandler)
	api.RouteNotFound("/*", echo.NotFoundHandler)

	return server, nil
}

func releaseMetadata(revision string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if revision != "" {
				c.Response().Header().Set("X-Release-Sha", revision)
			}
			return next(c)
		}
	}
}
