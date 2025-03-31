import puppeteer from 'puppeteer'

export default class Parser {
  async fetch(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    try {
      const start = Date.now()
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 })
      const responseTime = Date.now() - start

      const html = await page.content()
      await browser.close()

      const duration = (Date.now() - start) / 1000
      process.stdout.write(`\n✅ [Loaded] ${url} – ${duration} s\n`) // Гарантированный немедленный вывод

      return { html, responseTime, url }
    } catch (error) {
      await page.close()
      console.error(`❌ Failed to load ${url}: ${error.message}`)
      process.exit(1)
    }
  }
}