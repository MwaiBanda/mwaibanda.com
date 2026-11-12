package db

import (
	"database/sql"
	"path/filepath"
	"testing"

	"github.com/jmoiron/sqlx"
)

func TestMigrateFreshDatabase(testCase *testing.T) {
	database, err := sql.Open("libsql", "file:"+filepath.Join(testCase.TempDir(), "migration.db"))
	if err != nil {
		testCase.Fatal(err)
	}
	instance := &Instance{DB: sqlx.NewDb(database, "sqlite3")}
	testCase.Cleanup(func() {
		if err := database.Close(); err != nil {
			testCase.Error(err)
		}
	})
	for attempt := 0; attempt < 2; attempt++ {
		if err := instance.Migrate(); err != nil {
			testCase.Fatal(err)
		}
		for _, table := range []string{"articles", "projects"} {
			var count int
			if err := instance.DB.Get(&count, "SELECT COUNT(*) FROM "+table); err != nil {
				testCase.Fatalf("query migrated table %s: %v", table, err)
			}
			if count != 0 {
				testCase.Fatalf("fresh table %s has %d rows", table, count)
			}
		}
	}
}