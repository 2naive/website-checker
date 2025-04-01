import { jest } from '@jest/globals'

jest.unstable_mockModule('lighthouse', () => ({
  default: jest.fn()
}))

jest.setTimeout(15000) // 15 секунд

const { default: lighthouse } = await import('lighthouse')
const lighthousePerformanceCheck = (await import('../../checks/performance/lighthousePerformanceCheck')).default

beforeEach(() => {
  jest.clearAllMocks()
})

test('Lighthouse performance check passes when score is high', async () => {
  lighthouse.mockImplementation(() => Promise.resolve({
    lhr: { categories: { performance: { score: 0.95 } } }
  }))

  const content = { url: 'https://example.com' }

  const result = await lighthousePerformanceCheck(content)
  expect(result.passed).toBe(true)
})

test('Lighthouse performance check fails when score is low', async () => {
  lighthouse.mockImplementation(() => Promise.resolve({
    lhr: { categories: { performance: { score: 0.45 } } }
  }))

  const content = { url: 'https://example.com' }

  const result = await lighthousePerformanceCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.actual).toBe('45')
})
