import headingsCheck from '../../checks/seo/headingsStructureCheck'

test('Headings check passes with correct heading structure', async () => {
  const content = {
    html: `
      <h1>Main Heading</h1>
      <h2>Sub Heading</h2>
      <h3>Nested Sub Heading</h3>
    `
  }

  const result = await headingsCheck(content)
  expect(result.passed).toBe(true)
})

test('Headings check fails without H1 heading', async () => {
  const content = {
    html: `
      <h2>Sub Heading without H1</h2>
      <h3>Nested Sub Heading</h3>
    `
  }

  const result = await headingsCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ message: expect.stringContaining('Expected exactly one <h1> tag, found 0.') })
  ]))
})
