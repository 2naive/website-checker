import htmlValidator from 'html-validator'

export default async function htmlValidationCheck(content) {
  const options = { data: content.html, format: 'json' }
  const result = await htmlValidator(options)
  const errors = result.messages
    .filter(msg => msg.type === 'error')
    .map(msg => ({ group: `${msg.lastLine}:${msg.lastColumn}`, message: msg.message}))

  return {
    passed: errors.length === 0,
    details: {
      actual: `${errors.length} errors`,
      recommended: '0 errors',
      message: errors.length ? 'HTML contains validation errors.' : '',
      errors
    }
  }
}
