import metaTagsCheck from '../../checks/seo/metaTagsCheck'

test('Meta tags check passes when all required tags are present', async () => {
  const content = {
    html: `
      <html>
        <head>
          <title>Example Title</title>
          <meta name="description" content="An example description.">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="canonical" href="https://example.com">
        </head>
      </html>`
  }

  const result = await metaTagsCheck(content)
  expect(result.passed).toBe(true)
})

test('Meta tags check fails when description is missing', async () => {
  const content = {
    html: `
      <html>
        <head>
          <title>Example Title</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="canonical" href="https://example.com">
        </head>
      </html>`
  }

  const result = await metaTagsCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ message: 'Missing meta tag: description' })
  ]))
})

test('Meta tags check fails when viewport is missing', async () => {
  const content = {
    html: `
      <html>
        <head>
          <title>Example Title</title>
          <meta name="description" content="An example description.">
          <link rel="canonical" href="https://example.com">
        </head>
      </html>`
  }

  const result = await metaTagsCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ message: 'Missing meta tag: viewport' })
  ]))
})

test('Meta tags check fails when canonical is missing', async () => {
  const content = {
    html: `
      <html>
        <head>
          <title>Example Title</title>
          <meta name="description" content="An example description.">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
      </html>`
  }

  const result = await metaTagsCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ message: 'Missing meta tag: canonical' })
  ]))
})
