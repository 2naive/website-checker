// __tests__/seo/duplicateUrlsCheck.test.js
import duplicateUrlsCheck from '../../checks/seo/duplicateUrlsCheck'

test('Duplicate URLs check passes if there are no duplicate URLs', async () => {
  const visitedUrls = new Set([
    'https://example.com',
    'https://example.com/about',
    'https://example.com/contact'
  ])

  const result = await duplicateUrlsCheck(null, visitedUrls)

  expect(result.passed).toBe(true)
})

test('Duplicate URLs check fails if there are duplicate URLs', async () => {
  const visitedUrls = new Set([
    'https://example.com',
    'https://example.com/',
    'https://example.com/about',
    'https://example.com/about/'
  ])

  const result = await duplicateUrlsCheck(null, visitedUrls)

  expect(result.passed).toBe(false)
  expect(result.details.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ message: expect.stringContaining('Duplicate URLs: https://example.com, https://example.com/') }),
    expect.objectContaining({ message: expect.stringContaining('Duplicate URLs: https://example.com/about, https://example.com/about/') })
  ]))
})
