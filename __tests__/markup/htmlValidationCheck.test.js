import htmlValidationCheck from '../../checks/markup/htmlValidationCheck'

test('HTML validation passes with valid HTML', async () => {
  const content = {
    html: '<!DOCTYPE html><html><head><title>Valid</title></head><body><p>Hello World!</p></body></html>'
  }

  const result = await htmlValidationCheck(content)
  expect(result.passed).toBe(true)
})

test('HTML validation fails with invalid HTML', async () => {
  const content = {
    html: '<html><head><title>Invalid</title></head><body><div><p>Unclosed div</body></html>'
  }

  const result = await htmlValidationCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.errors.length).toBeGreaterThan(0)
})
