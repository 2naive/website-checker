import pkg from 'broken-link-checker'
const { SiteChecker } = pkg

export default function brokenLinksCheck(content) {
  return new Promise(resolve => {
    const brokenLinks = []
    const checker = new SiteChecker({}, {
      link: result => {
        if (result.broken && result.url && result.url.resolved) {
          brokenLinks.push({ message: `Broken link: ${result.url.resolved}` })
        }
      },
      end: () => {
        resolve({
          passed: brokenLinks.length === 0,
          details: {
            actual: `${brokenLinks.length} broken links`,
            recommended: '0 broken links',
            errors: brokenLinks
          }
        })
      }
    })
    checker.enqueue(content.url)
  })
}
