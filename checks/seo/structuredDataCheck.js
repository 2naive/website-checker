import { structuredDataTest } from 'structured-data-testing-tool'
import presets from 'structured-data-testing-tool/presets.js'

const excludedPresets = ['SocialMedia']
const allPresets = Object.values(presets).filter(preset => !excludedPresets.includes(preset.name))

export const scope = 'page'

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
      passed: errors.length === 0,
      details: {
        actual: errors.length ? `${errors.length} issues` : 'Valid structured data',
        recommended: 'Valid structured data without errors',
        message: errors.length ? 'Structured data contains validation errors' : '',
        errors
      }
    }
  } catch (error) {
    const failedTests = error.res?.failed || []
    const errors = failedTests.map(err => ({
      group: err.group,
      message: `${err.description}: ${err.error.message}`
    }))

    return {
      passed: false,
      details: {
        actual: 'Validation failed',
        recommended: 'Valid structured data without errors',
        message: errors.length ? 'Structured data validation errors occurred' : error.message,
        errors: errors.length ? errors : [{ message: error.message }]
      }
    }
  }
}
