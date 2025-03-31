import { XMLParser, XMLValidator } from 'fast-xml-parser'

export const scope = 'site'
export default async function sitemapCheck(content) {
  const sitemapUrl = `${new URL(content.url).origin}/sitemap.xml`

  try {
    const response = await fetch(sitemapUrl)

    if (!response.ok) {
      return {
        passed: false,
        details: {
          actual: `HTTP Status ${response.status}`,
          recommended: 'Valid sitemap.xml at root (status 200)',
          message: 'sitemap.xml not accessible'
        }
      }
    }

    const xmlData = await response.text()

    const validation = XMLValidator.validate(xmlData)
    if (validation !== true) {
      return {
        passed: false,
        details: {
          actual: 'Invalid sitemap.xml',
          recommended: 'Valid XML structure',
          message: 'Invalid sitemap structure'
        }
      }
    }

    const parser = new XMLParser()
    const jsonObj = parser.parse(xmlData)

    const urls = jsonObj.urlset && jsonObj.urlset.url
      ? Array.isArray(jsonObj.urlset.url)
        ? jsonObj.urlset.url
        : [jsonObj.urlset.url]
      : []

    return {
      passed: urls.length > 0,
      details: {
        actual: `${urls.length} URLs in sitemap`,
        recommended: '> 0 URLs',
        message: urls.length > 0 ? '' : 'No URLs found in sitemap'
      }
    }
  } catch (e) {
    return {
      passed: false,
      details: {
        actual: 'No sitemap found',
        recommended: 'Valid sitemap.xml at root',
        message: e.message
      }
    }
  }
}
