import structuredDataCheck from '../../checks/seo/structuredDataCheck'

test('Structured data check passes with valid Open Graph and Twitter tags', async () => {
  const content = {
    html: `
      <html>
        <head>
          <meta property="og:title" content="Example Title">
          <meta property="og:type" content="website">
          <meta property="og:url" content="https://example.com">
          <meta property="og:image" content="https://example.com/image.jpg">
          <meta property="og:image:alt" content="Example Image">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="Example Title">
          <meta name="twitter:description" content="Example Description">
          <meta name="twitter:image" content="https://example.com/image.jpg">
          <meta name="twitter:image:alt" content="Example Image">
        </head>
        <body></body>
      </html>`
  }

  const result = await structuredDataCheck(content)
  expect(result.passed).toBe(true)
})

test('Structured data check fails with missing required Open Graph tags', async () => {
  const content = {
    html: `
      <html>
        <head>
          <meta property="og:title" content="Example Title">
        </head>
        <body></body>
      </html>`
  }

  const result = await structuredDataCheck(content)
  expect(result.passed).toBe(false)
  expect(result.details.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ message: expect.stringContaining('og:type') }),
    expect.objectContaining({ message: expect.stringContaining('og:url') }),
    expect.objectContaining({ message: expect.stringContaining('og:image') }),
  ]))
})
