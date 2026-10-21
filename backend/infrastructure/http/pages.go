package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/labstack/echo/v4"
)

type publicPage struct {
	Name string `json:"name"`
	Path string `json:"path"`
	File string `json:"file"`
}

func RegisterPublicPages(server *echo.Echo, root string) error {
	index := filepath.Join(root, "index.html")
	server.File("/", index)
	server.File("/portfolio", index)
	server.File("/sitemap.xml", filepath.Join(root, "sitemap.xml"))
	server.File("/robots.txt", filepath.Join(root, "robots.txt"))
	data, err := os.ReadFile(filepath.Join(root, "prerender-manifest.json"))
	if os.IsNotExist(err) {
		server.File("/blog/:article", index)
		return nil
	}
	if err != nil {
		return fmt.Errorf("read public-page manifest: %w", err)
	}
	var entries []publicPage
	if err := json.Unmarshal(data, &entries); err != nil {
		return fmt.Errorf("decode public-page manifest: %w", err)
	}
	pages := make(map[string]publicPage, len(entries))
	for _, entry := range entries {
		if !filepath.IsLocal(entry.File) || !strings.HasPrefix(entry.Path, "/blog/") || entry.Name == "" {
			return fmt.Errorf("invalid public-page manifest entry")
		}
		pages[entry.Name] = entry
	}
	notFound, err := os.ReadFile(filepath.Join(root, "404.html"))
	if err != nil {
		return fmt.Errorf("read public not-found page: %w", err)
	}
	server.GET("/blog/:article", func(c echo.Context) error {
		name := c.Param("article")
		page, found := pages[strings.ToLower(name)]
		if !found {
			if decoded, err := url.PathUnescape(name); err == nil {
				page, found = pages[strings.ToLower(decoded)]
			}
		}
		if !found {
			return c.HTMLBlob(http.StatusNotFound, notFound)
		}
		if c.Request().URL.EscapedPath() != page.Path {
			location := page.Path
			if query := c.Request().URL.RawQuery; query != "" {
				location += "?" + query
			}
			return c.Redirect(http.StatusMovedPermanently, location)
		}
		return c.File(filepath.Join(root, page.File))
	})
	return nil
}
