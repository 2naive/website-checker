import * as cheerio from 'cheerio'

export const scope = 'page'

export default async function titleLengthCheck(content) {
  const $ = cheerio.load(content.html)
  const title = $('title').text().trim()

  const errors = []

  if (title.length < 10) {
    errors.push({ message: 'Title is too short' })
  } else if (title.length > 60) {
    errors.push({ message: 'Title is too long' })
  }

  return {
    passed: errors.length === 0,
    details: {
      actual: `Title length: ${title.length}`,
      recommended: 'Title length between 10 and 60 characters',
      errors
    }
  }
}
