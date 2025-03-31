import robotsCheck from '../../checks/seo/robotsCheck'
import { jest } from '@jest/globals'

beforeEach(() => {
  global.fetch = jest.fn()
})

test('Robots check passes if robots.txt allows crawling', async () => {
  const content = { url: 'https://example.com' }

  global.fetch.mockResolvedValue({
    status: 200,
    text: () => Promise.resolve('User-agent: *\nDisallow:')
  })

  const result = await robotsCheck(content)
  expect(result.passed).toBe(true)
})

test('Robots check fails if robots.txt disallows crawling', async () => {
  const content = { url: 'https://example.com/private' }

  global.fetch.mockResolvedValue({
    status: 200,
    text: () => Promise.resolve('User-agent: *\nDisallow: /private')
  })

  const result = await robotsCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.message).toMatch(/disallowed/i)
})

test('Robots check fails if robots.txt is not accessible', async () => {
  const content = { url: 'https://example.com' }

  global.fetch.mockResolvedValue({
    status: 404,
    text: () => Promise.resolve('Not Found')
  })

  const result = await robotsCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.message).toMatch(/robots\.txt not accessible/)
})
