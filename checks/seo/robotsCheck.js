import robotsParser from 'robots-parser'

export const scope = 'site'

export default async function robotsCheck(content) {
  const robotsUrl = `${new URL(content.url).origin}/robots.txt`

  try {
    const response = await fetch(robotsUrl)

    if (response.status !== 200) {
      return {
        passed: false,
        details: {
          actual: `Status: ${response.status}`,
          recommended: '200 OK',
          message: 'robots.txt not accessible'
        }
      }
    }

    const robotsTxt = await response.text()
    const robots = robotsParser(robotsUrl, robotsTxt)

    const isAllowed = robots.isAllowed(content.url)

    return {
      passed: isAllowed,
      details: {
        actual: robotsTxt ? 'robots.txt exists' : 'No robots.txt',
        recommended: 'robots.txt should exist and allow crawling',
        message: isAllowed ? '' : 'Crawling disallowed in robots.txt'
      }
    }
  } catch (e) {
    return {
      passed: false,
      details: {
        actual: 'Error fetching robots.txt',
        recommended: 'robots.txt file present',
        message: e.message
      }
    }
  }
}
