import { structuredDataTest } from 'structured-data-testing-tool'
import presets from 'structured-data-testing-tool/presets.js'

const allPresets = Object.values(presets)

export default async function structuredDataCheck(content) {
  try {
    const results = await structuredDataTest(content.html, {
      presets: allPresets,
    })

    const errors = results.failed.map(err => ({
      group: err.group,
      message: `${err.description}: ${err.error.message}`
    }))

    return {
      passed: results.passed.length > 0 && errors.length === 0,
      details: {
        actual: `${results.passed.length} structured data items valid`,
        recommended: 'At least one valid structured data item',
        errors
      }
    }
  } catch (error) {
    const errors = error.res?.failed?.map(err => ({
      group: err.group,
      message: `${err.description}: ${err.error.message}`
    })) || [{ message: error.message }]

    return {
      passed: false,
      details: {
        actual: 'Validation failed',
        recommended: 'Valid structured data without errors',
        errors
      }
    }
  }
}
