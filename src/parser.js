import puppeteer from 'puppeteer'

export default class Parser {
  async fetch(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const start = Date.now()
    await page.goto(url, { waitUntil: 'networkidle2' })
    const responseTime = Date.now() - start

    const html = await page.content()

    await browser.close()

    return { html, responseTime, url }
  }
}