import sitemapCheck from '../../checks/seo/sitemapCheck'
import { jest } from '@jest/globals'

beforeEach(() => {
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.resetAllMocks()
})

test('Sitemap check passes if sitemap.xml is accessible and valid', async () => {
  const content = { url: 'https://example.com' }

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve(`
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.w3.org/1999/xhtml http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"><url><loc>https://example.com/</loc><xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/"/><xhtml:link rel="alternate" hreflang="en" href="https://example.com/"/><xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru"/><lastmod>2024-12-17T18:43:50.611Z</lastmod></url><url><loc>https://example.com/ru</loc><xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/"/><xhtml:link rel="alternate" hreflang="en" href="https://example.com/"/><xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru"/><lastmod>2024-04-14T19:44:44.786Z</lastmod></url></urlset>`),
    })
  )

  const result = await sitemapCheck(content)
  expect(result.passed).toBe(true)
})

test('Sitemap check fails if sitemap.xml is not accessible', async () => {
  const content = { url: 'https://example.com' }

  global.fetch.mockResolvedValue({
    ok: false,
    status: 404,
    text: () => Promise.resolve('Not Found')
  })

  const result = await sitemapCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.message).toMatch(/sitemap\.xml not accessible/i)
})

test('Sitemap check fails if sitemap.xml is invalid', async () => {
  const content = { url: 'https://example.com' }

  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve('Invalid sitemap content')
  })

  const result = await sitemapCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.message).toMatch(/invalid sitemap structure/i)
})
