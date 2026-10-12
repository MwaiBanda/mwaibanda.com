package project

import (
	"context"

	"MwaiBanda/backend/domain/project"
	"MwaiBanda/backend/infrastructure/persistence"
)

func (r *Repository) GetAllProjects(ctx context.Context) ([]project.Project, error) {
	var projects []project.Project
	query := persistence.LoadFile("repository/project/sql/get_all_projects.sql")
	err := r.db.SelectContext(ctx, &projects, query)
	if err != nil {
		return nil, err
	}
	return projects, nil
}
