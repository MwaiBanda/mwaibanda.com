package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Article holds the schema definition for the Article entity.
type Article struct {
	ent.Schema
}

// Fields of the Article.
func (Article) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.String("publicationDate"),
		field.String("image"),
		field.String("summary"),
		field.String("body"),
		field.Strings("tags"),
	}
}

// Edges of the Article.
func (Article) Edges() []ent.Edge {
	return nil
}
