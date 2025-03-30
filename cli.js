const { Command } = require('commander')
const Parser = require('./src/parser')
const Auditor = require('./src/auditor')
const jsonReporter = require('./src/reporters/jsonReporter')

const program = new Command()
program
  .argument('<url>', 'URL of the website to audit')
  .option('-j, --json <path>', 'Export results to JSON file')
  .option('-c, --config <path>', 'Config file path', './config.json')
  .parse(process.argv)

;(async () => {
  const url = program.args[0]
  const { json, config } = program.opts()
  const parser = new Parser()
  const auditor = new Auditor(parser, Auditor.loadChecks(config))

  const results = await auditor.audit(url)
  console.log('\nAudit Results:\n')
  Object.entries(results).forEach(([check, result]) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL'
    console.log(`${status} ${check}`)
  })

  if (json) jsonReporter(results, json)

  const hasFailures = Object.values(results).some(check => !check.passed)
  process.exit(hasFailures ? 1 : 0)
})()