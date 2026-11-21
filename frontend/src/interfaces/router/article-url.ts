export const siteOrigin = 'https://mwaibanda.com'

export function articleSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function articlePath(name: string) {
  return `/blog/${articleSlug(name)}`
}