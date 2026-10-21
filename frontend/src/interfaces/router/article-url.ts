export const siteOrigin = 'https://mwaibanda.com'

export function articlePath(name: string) {
  return `/blog/${encodeURIComponent(name.toLowerCase())}`
}