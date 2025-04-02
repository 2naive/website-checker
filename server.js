import http from 'http'
import fs from 'fs'
import url from 'url'
import Auditor from './src/auditor.js'
import Parser from './src/parser.js'

const PORT = 3000
const parser = new Parser()
const checks = await Auditor.loadChecks()

http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true)

  if (parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    fs.createReadStream('./public/index.html').pipe(res)
  } else if (parsedUrl.pathname === '/checks') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(checks.map(c => c.name)))
  } else if (parsedUrl.pathname === '/audit') {
    const { site, depth, include = '', exclude = '' } = parsedUrl.query

    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked'
    })

    const selectedChecks = checks.filter(({ name }) => {
      const inc = include ? include.split(',') : []
      const exc = exclude ? exclude.split(',') : []
      if (inc.length > 0) return inc.includes(name)
      if (exc.length > 0) return !exc.includes(name)
      return true
    })

    const auditor = new Auditor(parser, selectedChecks)

    const auditResults = {
      passedCount: 0,
      failedCount: 0,
      results: []
    }

    await auditor.audit(site, Number(depth) || 0, new Set(), (name, result, pageUrl, duration) => {
      const [group, checkName] = name.split(/\\|\//)

      // промежуточный статус без деталей ошибок
      res.write(`${result.passed ? '✅' : '❌'} [${group}\\${checkName}] (${pageUrl}) - ${duration} ms\n`)

      auditResults.results.push({
        group,
        checkName,
        pageUrl,
        status: result.passed,
        duration,
        details: {
          recommended: result.details.recommended || '',
          actual: result.details.actual || '',
          errors: result.details.errors || []
        }
      })

      if (result.passed) {
        auditResults.passedCount++
      } else {
        auditResults.failedCount++
      }
    })

    // Итоговый вывод JSON после завершения всех проверок
    res.write('\n\n==== Audit Complete ====\n')
    res.end(JSON.stringify(auditResults, null, 2))
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
}).listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`))
