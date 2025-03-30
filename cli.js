// === cli.js ===
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

console.log('\nAudit Results:\n')

let passedCount = 0
let failedCount = 0
const errors = []

const content = await parser.fetch(url)

await Promise.all(auditor.checks.map(async ({ name, check }) => {
  const result = await check(content)
  const parts = name.split(/\\|\//)
  const group = parts.length > 1 ? parts[0] : 'General'
  const checkName = parts.length > 1 ? parts[1] : parts[0]
  const status = result.passed ? '✅ PASS' : '❌ FAIL'

  console.log(`${status} [${formatCheckName(group)}] ${formatCheckName(checkName)}`)

  if (result.passed) {
    passedCount += 1
  } else {
    failedCount += 1
    errors.push({ check: `${formatCheckName(group)}: ${formatCheckName(checkName)}`, details: result.details })
  }
}))

console.log('\nSummary:')
console.log(`✅ Passed: ${passedCount}`)
console.log(`❌ Failed: ${failedCount}\n`)

if (errors.length) {
  console.log('Error Details:\n')
  errors.forEach(({ check, details }) => {
    console.log(`❌ ${check}`)
    if (details.errors && Array.isArray(details.errors)) {
      details.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. Line ${error.lastLine}, Column ${error.lastColumn}: ${error.message}`)
      })
    } else {
      console.log(`- ${details.message} (Actual: ${details.actual}, Recommended: ${details.recommended})\n`)
    }
  })
}

if (json) jsonReporter({ passedCount, failedCount, errors }, json)

process.exit(failedCount ? 1 : 0)
