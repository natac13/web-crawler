const { test, expect } = require('@jest/globals')

const { normalizeURL, getUrlsFromHTML } = require('./crawl')

/*
https://blog.boot.dev/path/
https://blog.boot.dev/path
http://blog.boot.dev/path/
http://blog.boot.dev/path


should all return blog.boot.dev/path
*/

test('normalizeURL', () => {
  expect(normalizeURL('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path')
  expect(normalizeURL('https://blog.boot.dev/path')).toBe('blog.boot.dev/path')
  expect(normalizeURL('http://blog.boot.dev/path/')).toBe('blog.boot.dev/path')
  expect(normalizeURL('http://blog.boot.dev/path')).toBe('blog.boot.dev/path')
})

test('getUrlsFromHTML', () => {
  const htmlBody = `
<!DOCTYPE html>
<html>
  <body>
    <a href="https://blog.boot.dev/path/">Link 1</a>
    <a href="https://blog.boot.dev/path">Link 2</a>
    <a href="http://blog.boot.dev/path/">Link 3</a>
    <a href="http://blog.boot.dev/path">Link 4</a>
  </body>
</html>
`
  const urls = getUrlsFromHTML(htmlBody, 'https://blog.boot.dev/')
  expect(urls).toEqual([
    'https://blog.boot.dev/path/',
    'https://blog.boot.dev/path',
    'http://blog.boot.dev/path/',
    'http://blog.boot.dev/path'
  ])
})
