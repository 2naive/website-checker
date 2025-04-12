import puppeteer from 'puppeteer'

export default class Parser {
  constructor (onLog = () => {}) {
    this.onLog = onLog
  }

  async fetch (url) {
    let browser
    let page
    try {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      page = await browser.newPage()

      const start = Date.now()
      await page.goto(url, { waitUntil: 'load', timeout: 15000 }) // networkidle2
      const responseTime = Date.now() - start

      const html = await page.content()
      const duration = ((Date.now() - start) / 1000).toFixed(2)

      const successMsg = `\n✅ [Loaded] ${url} – ${duration} s\n`
      this.onLog(successMsg)

      await browser.close()

      return { html, responseTime, url }
    } catch (error) {
      if (page) await page.close()
      if (browser) await browser.close()

      const errorMsg = `\n❌ Failed to load ${url}: ${error.message}\n`
      this.onLog(errorMsg)

      return { html: '', responseTime: null, url, error: error.message }
    }
  }
}
