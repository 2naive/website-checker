import * as cheerio from 'cheerio'

export const scope = 'page'

export default async function headingsStructureCheck(content) {
  const $ = cheerio.load(content.html)
  const errors = []

  const headings = $('h1, h2, h3, h4, h5, h6').map((_, el) => ({
    level: parseInt(el.tagName.slice(1)),
    text: $(el).text().trim()
  })).get()

  if (headings.filter(h => h.level === 1).length !== 1) {
    errors.push({ message: `Expected exactly one <h1> tag, found ${headings.filter(h => h.level === 1).length}.` })
  }

  let prevLevel = 0
  headings.forEach(({ level, text }) => {
    if (prevLevel && (level - prevLevel) > 1) {
      errors.push({ message: `<h${level}> (“${text}”) should not appear directly after <h${prevLevel}>.` })
    }
    prevLevel = level
  })

  return {
    passed: errors.length === 0,
    details: {
      actual: errors.length ? `${errors.length} issues` : 'Correct headings structure',
      recommended: 'One <h1> and properly nested headings (h2-h6)',
      errors
    }
  }
}
