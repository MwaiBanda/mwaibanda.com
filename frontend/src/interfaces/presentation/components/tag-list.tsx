export default function TagList({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null

  return <ul aria-label="Tags" className="content-tags">
    {tags.map((tag, index) => <li key={`${tag}-${index}`} className="content-tag">{tag}</li>)}
  </ul>
}