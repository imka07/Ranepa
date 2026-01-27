export default defineEventHandler((event) => {
  const siteUrl = 'https://ranepa-beta.vercel.app'
  
  const robotsTxt = `User-agent: *
Allow: /

User-agent: Yandex
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`

  event.node.res.setHeader('Content-Type', 'text/plain')
  return robotsTxt
})
