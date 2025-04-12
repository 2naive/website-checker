import puppeteer from 'puppeteer'

export default async function lighthousePerformanceCheck(content) {
  const { default: lighthouse } = await import('lighthouse')
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  })
  const options = {
    logLevel: 'error',
    output: 'json',
    port: new URL(browser.wsEndpoint()).port,
    disableStorageReset: true
  }

  const runnerResult = await lighthouse(content.url, options)
  const performanceScore = runnerResult.lhr.categories.performance.score * 100

  await browser.close()

  return {
    passed: performanceScore >= 80,
    details: {
      actual: `${performanceScore}`,
      recommended: '≥ 80',
      message: performanceScore < 80 ? 'Performance score below recommended.' : ''
    }
  }
}