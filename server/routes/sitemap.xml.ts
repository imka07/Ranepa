export default defineEventHandler((event) => {
  const siteUrl = 'https://ranepa-beta.vercel.app'
  const currentDate = new Date().toISOString()

  const urls = [
    {
      loc: '/',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: '/#services',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: '/#about',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: '/#reviews',
      changefreq: 'weekly',
      priority: '0.6'
    },
    {
      loc: '/#faq',
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      loc: '/#contact',
      changefreq: 'monthly',
      priority: '0.5'
    }
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${siteUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})