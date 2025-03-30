import * as chromeLauncher from 'chrome-launcher'

export default async function lighthousePerformanceCheck(content) {
  const { default: lighthouse } = await import('lighthouse')
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  const options = {
    logLevel: 'error',
    output: 'json',
    port: chrome.port,
    disableStorageReset: true
  }

  const runnerResult = await lighthouse(content.url, options)
  const performanceScore = runnerResult.lhr.categories.performance.score * 100

  await chrome.kill()

  return {
    passed: performanceScore >= 80,
    details: { performanceScore, recommended: '>=80' }
  }
}
