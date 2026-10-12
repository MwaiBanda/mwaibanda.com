package db

import (
	"MwaiBanda/backend/application/config"
	"context"
	"database/sql"
	"embed"
	"errors"
	"os"
	"path/filepath"

	"github.com/jmoiron/sqlx"
	"github.com/pressly/goose/v3"
	"github.com/tursodatabase/go-libsql"
)

//go:embed migrations/*.sql
var migrationFiles embed.FS

type Instance struct {
	DB        *sqlx.DB
	connector *libsql.Connector
	tempDir   string
}

func GetDatabaseInstance(cfg *config.Config) (*Instance, error) {
	tempDir, err := os.MkdirTemp("", "libsql-*")
	if err != nil {
		return nil, err
	}
	dbPath := filepath.Join(tempDir, "replica.db")

	connector, err := libsql.NewEmbeddedReplicaConnector(
		dbPath,
		cfg.TursoDatabaseURL,
		libsql.WithAuthToken(cfg.TursoDatabaseToken),
	)
	if err != nil {
		_ = os.RemoveAll(tempDir)
		return nil, err
	}
	db := sqlx.NewDb(sql.OpenDB(connector), "sqlite3")
	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)
	return &Instance{DB: db, connector: connector, tempDir: tempDir}, nil
}

func (i *Instance) Migrate() error {
	if err := goose.SetDialect("sqlite3"); err != nil {
		return err
	}
	goose.SetBaseFS(migrationFiles)
	ctx := context.Background()
	if _, err := i.DB.ExecContext(ctx, `CREATE TABLE IF NOT EXISTS goose_db_version (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		version_id INTEGER NOT NULL,
		is_applied INTEGER NOT NULL,
		tstamp TIMESTAMP DEFAULT (datetime('now'))
	)`); err != nil {
		return err
	}
	if _, err := i.DB.ExecContext(ctx, `INSERT INTO goose_db_version (version_id, is_applied)
		SELECT 0, 1
		WHERE NOT EXISTS (SELECT 1 FROM goose_db_version)`); err != nil {
		return err
	}
	return goose.Up(i.DB.DB, "migrations")
}

func (i *Instance) Close() error {
	if i == nil {
		return nil
	}
	var closeErrors []error
	if i.DB != nil {
		if err := i.DB.Close(); err != nil {
			closeErrors = append(closeErrors, err)
		}
	}
	if i.connector != nil {
		if err := i.connector.Close(); err != nil {
			closeErrors = append(closeErrors, err)
		}
	}
	if err := os.RemoveAll(i.tempDir); err != nil {
		closeErrors = append(closeErrors, err)
	}
	return errors.Join(closeErrors...)
}
