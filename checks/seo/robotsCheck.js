import robotsParser from 'robots-parser'

export default async function robotsCheck(content) {
  const robotsUrl = `${new URL(content.url).origin}/robots.txt`
  try {
    const robotsTxt = await fetch(robotsUrl).then(res => res.text())
    const robots = robotsParser(robotsUrl, robotsTxt)

    return {
      passed: robots.isAllowed(content.url),
      details: {
        actual: robotsTxt ? 'robots.txt exists' : 'No robots.txt',
        recommended: 'robots.txt should exist and allow crawling',
        message: robots.isAllowed(content.url) ? '' : 'Crawling disallowed in robots.txt'
      }
    }
  } catch (e) {
    return {
      passed: false,
      details: { actual: 'No robots.txt', recommended: 'robots.txt file present', message: e.message }
    }
  }
}
