import * as cheerio from 'cheerio'

export const scope = 'page'

export default async function metaTagsCheck(content) {
  const $ = cheerio.load(content.html)

  const requiredTags = {
    title: $('title').text().trim(),
    description: $('meta[name="description"]').attr('content'),
    viewport: $('meta[name="viewport"]').attr('content'),
    canonical: $('link[rel="canonical"]').attr('href')
  }

  const missingTags = Object.entries(requiredTags)
    .filter(([_, value]) => !value)
    .map(([tag]) => tag)

  return {
    passed: missingTags.length === 0,
    details: {
      actual: missingTags.length ? `${missingTags.length} missing tags` : 'All required meta tags present',
      recommended: 'Meta tags: title, description, viewport, canonical present',
      message: missingTags.length
        ? `Missing meta tags: ${missingTags.join(', ')}`
        : 'All required meta tags are present',
      errors: missingTags.map(tag => ({ message: `Missing meta tag: ${tag}` }))
    }
  }
}
