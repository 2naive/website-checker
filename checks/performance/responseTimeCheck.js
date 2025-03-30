export default async function responseTimeCheck(content) {
  const responseTime = content.responseTime

  return {
    passed: responseTime < 2000,
    details: {
      actual: `${responseTime} ms`,
      recommended: '< 2000 ms',
      message: responseTime >= 2000 ? 'Response time too high.' : ''
    }
  }
}