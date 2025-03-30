import path from 'path'
import fs from 'fs'

export default class Auditor {
  constructor(parser, checks) {
    this.parser = parser
    this.checks = checks
  }

  async audit(url) {
    const content = await this.parser.fetch(url)

    const results = {}
    await Promise.all(this.checks.map(async ({ name, check }) => {
      const result = await check(content)
      results[name] = result
    }))

    return results
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
        return { name: checkPath, check: module.default }
      })
    )

    return loadedChecks
  }
}