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
  .option('-e, --exclude <items>', 'Comma-separated list of checks or groups to exclude (file names without folders and Check.js postfix, or group names)')
  .option('-d, --depth <number>', 'Depth of parsing child pages', parseInt, 0)
  .parse(process.argv)

const formatCheckName = (name) => {
  return name.split(/\\|\//)
    .map(part => part
      .replace(/Check$/, '')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase()))
    .join(' ')
}

const url = program.args[0]
const { json, config, exclude, depth } = program.opts()
const parser = new Parser()
let checks = await Auditor.loadChecks(config)

if (exclude) {
  const excludeItems = exclude.split(',').map(name => name.trim().toLowerCase())
  checks = checks.filter(({ name }) => {
    const parts = name.split(/\\|\//)
    const groupName = parts[0].toLowerCase()
    const fileName = parts.pop().replace(/Check$/, '').replace(/\.js$/, '').toLowerCase()
    return !(excludeItems.includes(fileName) || excludeItems.includes(groupName))
  })
}

const auditor = new Auditor(parser, checks)

console.log('\nAudit Results:\n')

let passedCount = 0
let failedCount = 0
const errors = []

await auditor.audit(url, depth, new Set(), (name, result, pageUrl) => {
  const parts = name.split(/\\|\//)
  const group = parts.length > 1 ? parts[0] : 'General'
  const checkName = parts.length > 1 ? parts[1] : parts[0]
  const status = result.passed ? '✅' : '❌'

  console.log(`${status} [${formatCheckName(group)}] ${formatCheckName(checkName)} (${pageUrl})`)

  if (result.passed) {
    passedCount += 1
  } else {
    failedCount += 1
    errors.push({ group: formatCheckName(group), checkName: formatCheckName(checkName), pageUrl, details: result.details })
  }
})


console.log('\nSummary:\n')
console.log(`✅ Passed: ${passedCount}`)
console.log(`❌ Failed: ${failedCount}`)

if (errors.length) {
  console.log('\nError Details:')

  errors.sort((a, b) =>
    a.pageUrl.localeCompare(b.pageUrl) ||
    a.group.localeCompare(b.group) ||
    a.checkName.localeCompare(b.checkName)
  )

  errors.forEach(({ group, checkName, pageUrl, details }, idx) => {
    console.log(`\n${idx + 1}. ❌ ${group}: ${checkName} (${pageUrl})`)
    if (details.message || details.actual || details.recommended) {
      console.log(`  ${details.message + ' ' || ''}(Actual: ${details.actual || '-'}, Recommended: ${details.recommended || '-'})`)
    }
    if (details.errors && Array.isArray(details.errors)) {
      details.errors.forEach((error, index) => {
        console.log(`   ${idx + 1}.${index + 1} ${error.group ? '[' + error.group + ']' : ''} ${error.message}`)
      })
    }
  })
}

if (json) jsonReporter({ passedCount, failedCount, errors }, json)

process.exit(failedCount ? 1 : 0)