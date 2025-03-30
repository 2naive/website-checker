import htmlValidator from 'html-validator'

export default async function htmlValidationCheck (content) {
  const options = {
    data: content.html,
    format: 'json'
  }

  const result = await htmlValidator(options)
  const errors = result.messages.filter(msg => msg.type === 'error')

  return {
    passed: errors.length === 0,
    details: { errorCount: errors.length, errors }
  }
}