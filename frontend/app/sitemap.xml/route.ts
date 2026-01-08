import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

  try {
    // Fetch all published news
    const newsResponse = await fetch(`${apiUrl}/news?limit=1000`)
    const newsData = await newsResponse.json()
    const news = newsData.data || newsData || []

    // Generate sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${baseUrl}/id</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/id/berita</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${news.map((item: any) => `
  <url>
    <loc>${baseUrl}/id/berita/${item.slug}</loc>
    <lastmod>${new Date(item.updated_at || item.published_at || item.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
  } catch (error) {
    // Return basic sitemap if API fails
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/id</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/id/berita</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`

    return new NextResponse(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

