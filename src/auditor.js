// === auditor.js ===
import path from 'path'
import fs from 'fs'
import { URL } from 'url'
import * as cheerio from 'cheerio'

export default class Auditor {
  constructor(parser, checks) {
    this.parser = parser
    this.checks = checks
  }

  async audit(url, depth = 0, visited = new Set(), onResult = () => {}) {
    const visitedUrls = new Set()

    const siteChecks = this.checks.filter(({ scope }) => scope === 'site')
    const finalChecks = this.checks.filter(({ scope }) => scope === 'final')
    const pageChecks = this.checks.filter(({ scope }) => scope !== 'site' && scope !== 'final')

    const siteContent = await this.parser.fetch(url)
    const context = { cheerio }

    await Promise.all(siteChecks.map(async ({ name, check }) => {
      const start = Date.now()
      const result = await check({ url, html: siteContent.html, context })
      const duration = Date.now() - start
      onResult(name, result, 'site-wide', duration)
    }))

    await this.auditPage(url, depth, visited, visitedUrls, pageChecks, onResult, context)

    await Promise.all(finalChecks.map(async ({ name, check }) => {
      const start = Date.now()
      const result = await check(null, visitedUrls, context)
      const duration = Date.now() - start
      onResult(name, result, 'final', duration)
    }))
  }

  async auditPage(url, depth, visited, visitedUrls, pageChecks, onResult, context) {
    if (visited.has(url) || depth < 0) return
    visited.add(url)
    visitedUrls.add(url)

    const content = await this.parser.fetch(url)

    await Promise.all(pageChecks.map(async ({ name, check }) => {
      const start = Date.now()
      const result = await check({ ...content, context })
      const duration = Date.now() - start
      onResult(name, result, url, duration)
    }))

    if (depth > 0) {
      const childUrls = this.extractLinks(content.html, url)
      await Promise.all(childUrls.map(childUrl =>
        this.auditPage(childUrl, depth - 1, visited, visitedUrls, pageChecks, onResult, context)
      ))
    }
  }

  extractLinks(html, baseUrl) {
    const $ = cheerio.load(html)
    const baseDomain = new URL(baseUrl).origin
    const links = new Set()

    $('a[href]').each((_, element) => {
      const href = $(element).attr('href')
      if (href && !href.startsWith('#')) {
        try {
          const url = new URL(href, baseUrl)
          url.hash = ''
          if (url.origin === baseDomain && url.pathname.match(/\/[^.]*$/)) {
            links.add(url.href)
          }
        } catch (_) {}
      }
    })

    return [...links]
  }

  static async loadChecks(configPath = './config.json') {
    let checksToLoad

    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath))
      checksToLoad = config.checks
    }

    if (!checksToLoad || checksToLoad.length === 0) {
      const categories = fs.readdirSync(path.join('checks'))
      checksToLoad = []
      categories.forEach(category => {
        const checks = fs.readdirSync(path.join('checks', category))
          .filter(file => file.endsWith('.js'))
          .map(file => path.join(category, file.replace('.js', '')))
        checksToLoad.push(...checks)
      })
    }

    const loadedChecks = await Promise.all(
      checksToLoad.map(async checkPath => {
        const fullPath = path.resolve(`checks/${checkPath}.js`)
        const module = await import(`file://${fullPath}`)
        return {
          name: checkPath,
          check: module.default,
          scope: module.scope || 'page'
        }
      })
    )

    return loadedChecks
  }
}
