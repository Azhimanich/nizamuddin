'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import Link from 'next/link'
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function BeritaDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = params?.locale || 'id'
  const slug = params?.slug || ''
  const [news, setNews] = useState<any>(null)

  useEffect(() => {
    if (slug) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/news/${slug}`)
        .then(res => res.json())
        .then(data => setNews(data))
        .catch(() => {})
    }
  }, [slug])

  // SEO useEffect - must be called before conditional return
  useEffect(() => {
    if (news) {
      const metaTitle = news.meta_title || news.title
      const metaDescription = news.meta_description || news.excerpt || ''
      const metaImage = news.featured_image?.startsWith('http') 
        ? news.featured_image 
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${news.featured_image}`
      const articleUrl = typeof window !== 'undefined' ? window.location.href : ''

      // Update document title
      document.title = `${metaTitle} | Pondok Pesantren Nizamuddin`

      // Update or create meta tags
      const updateMetaTag = (name: string, content: string, isProperty = false) => {
        const attribute = isProperty ? 'property' : 'name'
        let meta = document.querySelector(`meta[${attribute}="${name}"]`)
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute(attribute, name)
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', content)
      }

      // Basic meta tags
      updateMetaTag('description', metaDescription)
      updateMetaTag('keywords', news.tags?.map((t: any) => t.name || t).join(', ') || '')
      updateMetaTag('author', news.author || 'Pondok Pesantren Nizamuddin')

      // Open Graph tags
      updateMetaTag('og:type', 'article', true)
      updateMetaTag('og:url', articleUrl, true)
      updateMetaTag('og:title', metaTitle, true)
      updateMetaTag('og:description', metaDescription, true)
      updateMetaTag('og:image', metaImage, true)
      updateMetaTag('og:site_name', 'Pondok Pesantren Nizamuddin', true)
      updateMetaTag('article:published_time', news.published_at || news.created_at, true)
      updateMetaTag('article:author', news.author || 'Pondok Pesantren Nizamuddin', true)

      // Twitter tags
      updateMetaTag('twitter:card', 'summary_large_image')
      updateMetaTag('twitter:url', articleUrl)
      updateMetaTag('twitter:title', metaTitle)
      updateMetaTag('twitter:description', metaDescription)
      updateMetaTag('twitter:image', metaImage)

      // Add structured data
      let structuredData = document.getElementById('structured-data-article')
      if (!structuredData) {
        structuredData = document.createElement('script')
        structuredData.id = 'structured-data-article'
        structuredData.type = 'application/ld+json'
        document.head.appendChild(structuredData)
      }
      structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: news.title,
        description: metaDescription,
        image: metaImage,
        datePublished: news.published_at || news.created_at,
        dateModified: news.updated_at || news.published_at || news.created_at,
        author: {
          '@type': 'Person',
          name: news.author || 'Pondok Pesantren Nizamuddin'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Pondok Pesantren Nizamuddin',
          logo: {
            '@type': 'ImageObject',
            url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/logo.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl
        }
      })
    }
  }, [news])

  // Function to process content and convert newlines to proper HTML
  const processContent = (content: string) => {
    if (!content) return ''
    
    // Check if content already contains HTML tags
    const hasHtmlTags = /<[^>]+>/g.test(content)
    
    if (hasHtmlTags) {
      // If HTML already exists, just return it (but ensure paragraphs have proper spacing)
      return content
    }
    
    // If plain text, convert newlines to HTML
    // Split by double newlines (paragraph breaks)
    const paragraphs = content.split(/\n\n+/)
    
    // Process each paragraph
    const processedParagraphs = paragraphs.map(para => {
      // Trim whitespace
      const trimmed = para.trim()
      if (!trimmed) return ''
      
      // Replace single newlines with <br /> within paragraph
      const withBreaks = trimmed.replace(/\n/g, '<br />')
      
      // Wrap in paragraph tag
      return `<p>${withBreaks}</p>`
    }).filter(p => p) // Remove empty paragraphs
    
    return processedParagraphs.join('')
  }

  if (!news) {
    return (
      <Layout locale={locale}>
        <div style={{ paddingTop: '100px', minHeight: '100vh' }} className="flex items-center justify-center">
          <p className="text-gray-600">Memuat artikel...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout locale={locale}>
        <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <article className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Link
              href={`/${locale}/berita`}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Kembali ke Berita
            </Link>

            <div className="mb-6">
              <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(news.published_at || news.created_at), 'dd MMMM yyyy', { locale: id })}
                  </span>
                </div>
                {news.author && (
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700">Penulis:</span>
                    <span className="ml-2">{news.author}</span>
                  </div>
                )}
                {news.category && (
                  <div className="flex items-center">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {news.category.name || news.category}
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{news.title}</h1>
              {news.excerpt && (
                <p className="text-xl text-gray-600 mb-6">{news.excerpt}</p>
              )}
              {news.tags && news.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {news.tags.map((tag: any, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      #{tag.name || tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {news.featured_image && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img 
                  src={news.featured_image.startsWith('http') 
                    ? news.featured_image 
                    : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${news.featured_image}`} 
                  alt={news.title} 
                  className="w-full h-auto" 
                />
                {news.image_caption && (
                  <p className="mt-3 text-sm text-gray-600 text-center italic">
                    {news.image_caption}
                  </p>
                )}
              </div>
            )}

            <style jsx>{`
              .news-content {
                text-align: justify;
                line-height: 1.8;
              }
              .news-content p {
                margin-bottom: 1.5rem;
                text-align: justify;
                line-height: 1.8;
              }
              .news-content p:last-child {
                margin-bottom: 0;
              }
              .news-content br {
                display: block;
                content: "";
                margin-top: 0.75rem;
              }
              .news-content h1,
              .news-content h2,
              .news-content h3,
              .news-content h4,
              .news-content h5,
              .news-content h6 {
                margin-top: 2rem;
                margin-bottom: 1rem;
                text-align: left;
              }
              .news-content h1:first-child,
              .news-content h2:first-child,
              .news-content h3:first-child,
              .news-content h4:first-child,
              .news-content h5:first-child,
              .news-content h6:first-child {
                margin-top: 0;
              }
              .news-content ul,
              .news-content ol {
                margin-bottom: 1.5rem;
                padding-left: 1.5rem;
              }
              .news-content li {
                margin-bottom: 0.5rem;
              }
              .news-content img {
                margin: 2rem 0;
                border-radius: 0.5rem;
              }
            `}</style>
            <div 
              className="prose prose-lg max-w-none news-content"
              dangerouslySetInnerHTML={{ __html: processContent(news.content) }}
            />

            {/* Related Articles - Baca Juga */}
            {news.related_articles_data && news.related_articles_data.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Baca Juga</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {news.related_articles_data.map((related: any) => (
                    <Link
                      key={related.id}
                      href={`/${locale}/berita/${related.slug}`}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                    >
                      {related.featured_image && (
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={related.featured_image}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        {related.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {related.excerpt}
                          </p>
                        )}
                        <div className="flex items-center text-primary-600 font-semibold text-sm">
                          <span>Baca Selengkapnya</span>
                          <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {news.comments && news.comments.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Komentar</h3>
                <div className="space-y-4">
                  {news.comments.map((comment: any) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{comment.name}</h4>
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </Layout>
  )
}

