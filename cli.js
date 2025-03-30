import { Command } from 'commander'
import Parser from './src/parser.js'
import Auditor from './src/auditor.js'
import jsonReporter from './src/reporters/jsonReporter.js'

const program = new Command()

program
  .argument('<url>', 'URL of the website to audit')
  .option('-j, --json <path>', 'Export results to JSON file')
  .option('-c, --config <path>', 'Config file path', './config.json')
  .parse(process.argv)

const formatCheckName = (name) => {
  return name.split(/\\|\//)
    .map(part => part
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase()))
    .join(' ')
}

const url = program.args[0]
const { json, config } = program.opts()
const parser = new Parser()
const auditor = new Auditor(parser, await Auditor.loadChecks(config))

const results = await auditor.audit(url)

const groupedResults = {}
Object.entries(results).forEach(([check, result]) => {
  const parts = check.split(/\\|\//)
  const group = parts.length > 1 ? parts[0] : 'General'
  const checkName = parts.length > 1 ? parts[1] : parts[0]

  if (!groupedResults[group]) groupedResults[group] = []
  groupedResults[group].push({ name: checkName, result })
})

console.log('\nAudit Results:\n')
const errors = []
Object.entries(groupedResults).forEach(([group, checks]) => {
  console.log(`\n${formatCheckName(group)}:`)
  checks.forEach(({ name, result }) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL'
    console.log(`  ${status} ${formatCheckName(name)}`)
    if (!result.passed) {
      errors.push({ check: `${formatCheckName(group)}: ${formatCheckName(name)}`, details: result.details })
    }
  })
})

if (errors.length) {
  console.log('\nError Details:\n')
  errors.forEach(({ check, details }) => {
    console.log(`❌ ${check}`)
    console.log(JSON.stringify(details, null, 2))
  })
}

if (json) jsonReporter(results, json)

const hasFailures = errors.length > 0
process.exit(hasFailures ? 1 : 0)