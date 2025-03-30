const fs = require('fs')

function jsonReporter (results, outputPath) {
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
}

module.exports = jsonReporter