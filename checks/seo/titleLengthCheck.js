import * as cheerio from 'cheerio'

export default async function titleLengthCheck(content) {
  const $ = cheerio.load(content.html)
  const title = $('title').text().trim()
  const length = title.length

  return {
    passed: length >= 30 && length <= 60,
    details: { length, recommended: '30-60 chars', actual: title }
  }
}
