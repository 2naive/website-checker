import titleLengthCheck from '../../checks/seo/titleLengthCheck'

test('Title length check passes with correct length', async () => {
  const content = { html: '<html><head><title>Good Title</title></head></html>' }
  const result = await titleLengthCheck(content)

  expect(result.passed).toBe(true)
})

test('Title length check fails with short title', async () => {
  const content = { html: '<html><head><title>a</title></head></html>' }
  const result = await titleLengthCheck(content)

  expect(result.passed).toBe(false)
  expect(result.details.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ message: expect.stringContaining('too short') })
  ]))
})

test('Title length check fails with too long title', async () => {
  const longTitle = 'a'.repeat(100)
  const content = { html: `<html><head><title>${longTitle}</title></head></html>` }
  const result = await titleLengthCheck(content)

  expect(result.passed).toBe(false)
  expect(result.details.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ message: expect.stringContaining('too long') })
  ]))
})
