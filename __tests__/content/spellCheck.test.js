import { jest } from '@jest/globals'

jest.unstable_mockModule('cspell-lib', () => ({
  spellCheckDocument: jest.fn()
}))

const spellCheck = (await import('../../checks/content/spellCheck')).default
const { spellCheckDocument } = await import('cspell-lib')

beforeEach(() => {
  jest.clearAllMocks()
})

test('Spell check passes with correct English and Russian content', async () => {
  spellCheckDocument.mockResolvedValue({ issues: [] })

  const content = {
    html: '<p>Hello, this is a correct sentence. Привет, это корректное предложение.</p>'
  }

  const result = await spellCheck(content)
  expect(result.passed).toBe(true)
})

test('Spell check fails with misspelled English and Russian words', async () => {
  spellCheckDocument.mockResolvedValue({
    issues: [
      { text: 'Helo', offset: 0 },
      { text: 'коректное', offset: 40 }
    ]
  })

  const content = {
    html: '<p>Helo, this sentence has an error. Привет, это коректное предложение.</p>'
  }

  const result = await spellCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ message: 'Misspelled word "Helo" at position 0' }),
    expect.objectContaining({ message: 'Misspelled word "коректное" at position 40' })
  ]))
})
