import { spellCheckDocument } from 'cspell-lib'

export const scope = 'page'

export default async function spellCheck(content) {
  const text = content.html.replace(/<[^>]*>/g, ' ')

  const result = await spellCheckDocument({ uri: 'text', text }, {})

  const errors = result.issues.map(issue => ({
    message: `Misspelled word "${issue.text}" at position ${issue.offset}`
  }))

  return {
    passed: errors.length === 0,
    details: {
      actual: errors.length ? `${errors.length} misspelled words` : 'No spelling errors',
      recommended: 'Content without spelling errors',
      errors
    }
  }
}
