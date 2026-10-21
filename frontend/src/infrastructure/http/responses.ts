import * as v from 'valibot'

const contentUrl = v.union([
  v.literal(''),
  v.pipe(v.string(), v.url(), v.regex(/^https?:\/\//)),
  v.pipe(v.string(), v.regex(/^\/(?!\/)/)),
])

const articlesResponseSchema = v.pipe(
  v.array(v.object({
    name: v.pipe(v.string(), v.minLength(1)),
    image: contentUrl,
    publication_date: v.string(),
    summary: v.string(),
    body: v.string(),
    tags: v.array(v.string()),
  })),
  v.transform(articles => articles.map(({ publication_date, ...article }) => ({
    ...article,
    publicationDate: publication_date,
  }))),
)

const workResponseSchema = v.pipe(
  v.array(v.object({
    name: v.pipe(v.string(), v.minLength(1)),
    image: contentUrl,
    start_date: v.string(),
    end_date: v.string(),
    summary: v.string(),
    description: v.string(),
    link: contentUrl,
    tags: v.array(v.string()),
  })),
  v.transform(projects => projects.map(({ start_date, end_date, ...project }) => ({
    ...project,
    startDate: start_date,
    endDate: end_date,
  }))),
)

export function parseArticlesResponse(data: unknown) {
  return v.parse(articlesResponseSchema, data)
}

export function parseWorkResponse(data: unknown) {
  return v.parse(workResponseSchema, data)
}