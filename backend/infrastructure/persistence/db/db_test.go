package db

import (
	"context"
	"database/sql"
	"errors"
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
		if err := instance.Migrate(context.Background()); err != nil {
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

func TestMigrateReturnsWhenContextIsCanceled(t *testing.T) {
	database, err := sql.Open("libsql", "file:"+filepath.Join(t.TempDir(), "canceled-migration.db"))
	if err != nil {
		t.Fatal(err)
	}
	defer database.Close()

	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	err = (&Instance{DB: sqlx.NewDb(database, "sqlite3")}).Migrate(ctx)
	if !errors.Is(err, context.Canceled) {
		t.Fatalf("Migrate error = %v, want context.Canceled", err)
	}
}
