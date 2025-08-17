package controller

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"MwaiBanda/ent"

	entsql "entgo.io/ent/dialect/sql"
	"github.com/joho/godotenv"
	"github.com/tursodatabase/go-libsql"
)

type Controller struct {
	Client *ent.Client
	DB *sql.DB
	Connector *libsql.Connector
	Context context.Context
	TempDir string
}

func GetInstance() *Controller {
	controller := &Controller{
		Context: context.Background(),
	}
	err := godotenv.Load()
	if os.Getenv("ENV") == "DEV" {
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}
	tempDir, err := os.MkdirTemp("", "libsql-*")
	if err != nil {
		log.Fatalf("cannot create temp dir: %v", err)
	}
	controller.TempDir = tempDir
	dbPath := filepath.Join(controller.TempDir, "replica.db")

	connector, err := libsql.NewEmbeddedReplicaConnector(
		dbPath,
		os.Getenv("TURSO_DATABASE_URL"),
		libsql.WithAuthToken(os.Getenv("TURSO_AUTH_TOKEN")),
		// Optional: periodic sync
		// libsql.WithSyncInterval(time.Minute),
	)
	if err != nil {
		log.Fatalf("failed creating Turso connector: %v", err)
	}


	controller.Connector = connector
	controller.DB = sql.OpenDB(connector)
	controller.Client = ent.NewClient(ent.Driver(entsql.OpenDB("sqlite3", controller.DB)))
	
	// Auto-migrate schema
	if err := controller.Client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("failed running schema migration: %v", err)
	}

	fmt.Println("Connected and schema created!")
	return controller
}

func (c *Controller) CleanUp()  {
	os.RemoveAll(c.TempDir)
	c.Connector.Close()
	c.DB.Close()
	c.Client.Close()
}