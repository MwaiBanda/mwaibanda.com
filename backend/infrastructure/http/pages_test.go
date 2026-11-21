package http

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/labstack/echo/v4"
)

func TestRegisterPublicPagesRedirectsLegacyArticleURLs(t *testing.T) {
	root := t.TempDir()
	page := publicPage{
		Name: "clean architecture",
		Path: "/blog/clean-architecture",
		File: "blog/clean-architecture/index.html",
	}

	if err := os.MkdirAll(filepath.Join(root, filepath.Dir(page.File)), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, page.File), []byte("article page"), 0o600); err != nil {
		t.Fatal(err)
	}
	manifest, err := json.Marshal([]publicPage{page})
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, "prerender-manifest.json"), manifest, 0o600); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, "404.html"), []byte("not found"), 0o600); err != nil {
		t.Fatal(err)
	}

	server := echo.New()
	if err := RegisterPublicPages(server, root); err != nil {
		t.Fatal(err)
	}

	legacyRequest := httptest.NewRequest(http.MethodGet, "/blog/clean%20architecture?source=old-link", nil)
	legacyResponse := httptest.NewRecorder()
	server.ServeHTTP(legacyResponse, legacyRequest)
	if legacyResponse.Code != http.StatusMovedPermanently {
		t.Fatalf("legacy URL status = %d, want %d", legacyResponse.Code, http.StatusMovedPermanently)
	}
	if got, want := legacyResponse.Header().Get(echo.HeaderLocation), "/blog/clean-architecture?source=old-link"; got != want {
		t.Fatalf("legacy URL redirect = %q, want %q", got, want)
	}

	canonicalRequest := httptest.NewRequest(http.MethodGet, page.Path, nil)
	canonicalResponse := httptest.NewRecorder()
	server.ServeHTTP(canonicalResponse, canonicalRequest)
	if canonicalResponse.Code != http.StatusOK || canonicalResponse.Body.String() != "article page" {
		t.Fatalf("canonical URL response = (%d, %q), want (200, %q)", canonicalResponse.Code, canonicalResponse.Body.String(), "article page")
	}
}

func TestRegisterPublicPagesServesImages(t *testing.T) {
	root := t.TempDir()
	server := echo.New()
	if err := RegisterPublicPages(server, root); err != nil {
		t.Fatal(err)
	}

	for _, file := range []string{"favicon.png", "og-image.jpg"} {
		t.Run(file, func(t *testing.T) {
			content := []byte("image content")
			if err := os.WriteFile(filepath.Join(root, file), content, 0o600); err != nil {
				t.Fatal(err)
			}
			response := httptest.NewRecorder()
			server.ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/"+file, nil))
			if response.Code != http.StatusOK || response.Body.String() != string(content) {
				t.Fatalf("image response = (%d, %q), want (200, %q)", response.Code, response.Body.String(), content)
			}
		})
	}
}
