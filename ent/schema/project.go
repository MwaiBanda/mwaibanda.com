package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Project holds the schema definition for the Project entity.
type Project struct {
	ent.Schema
}

// Fields of the Project.
func (Project) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.String("startDate"),
		field.String("endDate"),
		field.String("image"),
		field.String("summary"),
		field.String("description"),
		field.String("link"),
		field.Strings("tags"),
	}
}

// Edges of the Project.
func (Project) Edges() []ent.Edge {
	return nil
}
