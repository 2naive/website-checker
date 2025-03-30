import fs from 'fs'

export default function jsonReporter(results, outputPath) {
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
}
