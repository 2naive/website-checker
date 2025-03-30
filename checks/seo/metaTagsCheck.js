import metascraper from 'metascraper'
import title from 'metascraper-title'
import description from 'metascraper-description'
import url from 'metascraper-url'

const scraper = metascraper([title(), description(), url()])

export default async function metaTagsCheck(content) {
  const metadata = await scraper({ html: content.html, url: content.url })

  const passed = metadata.title && metadata.description && metadata.url
  return {
    passed,
    details: {
      actual: metadata,
      recommended: 'Meta tags title, description, url present',
      message: passed ? '' : 'One or more meta tags are missing'
    }
  }
}
