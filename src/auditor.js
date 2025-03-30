const path = require('path')
const fs = require('fs')

class Auditor {
  constructor (parser, checks) {
    this.parser = parser
    this.checks = checks
  }

  async audit (url) {
    const content = await this.parser.fetch(url)

    const results = {}
    await Promise.all(this.checks.map(async (check) => {
      const result = await check(content)
      results[check.name] = result
    }))

    return results
  }

  static loadChecks (configPath = './config.json') {
    let checksToLoad

    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath))
      checksToLoad = config.checks
    }

    if (!checksToLoad || checksToLoad.length === 0) {
      const categories = fs.readdirSync(path.join(__dirname, '../checks'))
      checksToLoad = []
      categories.forEach(category => {
        const checks = fs.readdirSync(path.join(__dirname, '../checks', category))
          .filter(file => file.endsWith('.js'))
          .map(file => path.join(category, file.replace('.js', '')))
        checksToLoad.push(...checks)
      })
    }

    return checksToLoad.map(checkPath => require(path.join(__dirname, '../checks', `${checkPath}.js`)))
  }
}

module.exports = Auditor