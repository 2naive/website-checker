import responseTimeCheck from '../../checks/performance/responseTimeCheck'

test('Response time check passes for fast responses', async () => {
  const content = {
    responseTime: 500 // ms
  }

  const result = await responseTimeCheck(content)
  expect(result.passed).toBe(true)
})

test('Response time check fails for slow responses', async () => {
  const content = {
    responseTime: 3500 // ms
  }

  const result = await responseTimeCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.message).toMatch(/too high/)
})
