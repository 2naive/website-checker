export const scope = 'final'

export default async function duplicateUrlsCheck(_, visitedUrls) {
  const normalizedUrls = new Map()

  visitedUrls.forEach(url => {
    const normalized = url.replace(/\/$/, '')
    normalizedUrls.set(normalized, (normalizedUrls.get(normalized) || []).concat(url))
  })

  const duplicates = Array.from(normalizedUrls.values())
    .filter(urls => urls.length > 1)

  return {
    passed: duplicates.length === 0,
    details: {
      message: duplicates.length ? 'Duplicate URLs found.' : '',
      actual: `${duplicates.length} duplicates`,
      recommended: '0 duplicates',
      errors: duplicates.map(dups => ({
        message: `Duplicate URLs: ${dups.join(', ')}`
      }))
    }
  }
}
