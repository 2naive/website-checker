export default async function responseTimeCheck(content) {
  const responseTime = content.responseTime

  return {
    passed: responseTime < 2000,
    details: { responseTimeMs: responseTime, recommended: '<2000 ms' }
  }
}
