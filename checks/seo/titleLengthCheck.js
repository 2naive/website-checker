import * as cheerio from 'cheerio'

export default async function titleLengthCheck(content) {
  const $ = cheerio.load(content.html)
  const title = $('title').text().trim()
  const length = title.length

  return {
    passed: length >= 30 && length <= 60,
    details: {
      actual: `${length} chars`,
      recommended: '30-60 chars',
      message: length < 30 ? 'Title too short.' : (length > 60 ? 'Title too long.' : '')
    }
  }
}