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

    for (const { name, check } of siteChecks) {
      const result = await check({ url, html: siteContent.html })
      onResult(name, result, 'site-wide')
    }

    await this.auditPage(url, depth, visited, visitedUrls, pageChecks, onResult)

    for (const { name, check } of finalChecks) {
      const result = await check(null, visitedUrls)
      onResult(name, result, 'final')
    }
  }

  async auditPage(url, depth, visited, visitedUrls, pageChecks, onResult) {
    if (visited.has(url) || depth < 0) return
    visited.add(url)
    visitedUrls.add(url)

    const content = await this.parser.fetch(url)

    for (const { name, check } of pageChecks) {
      const result = await check(content)
      onResult(name, result, url)
    }

    if (depth > 0) {
      const childUrls = this.extractLinks(content.html, url)
      for (const childUrl of childUrls) {
        await this.auditPage(childUrl, depth - 1, visited, visitedUrls, pageChecks, onResult)
      }
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
