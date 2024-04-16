const { JSDOM } = require('jsdom')


function getUrlsFromHTML(htmlBody, baseURL) {
  const urls = []
  const dom = new JSDOM(htmlBody)
  const aElements = dom.window.document.querySelectorAll('a')
  for (const aElement of aElements) {
    if (aElement.href.slice(0, 1) === '/') {
      try {
        urls.push(new URL(aElement.href, baseURL).href)
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`)
      }
    } else {
      try {
        urls.push(new URL(aElement.href).href)
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`)
      }
    }
  }
  return urls
}
function normalizeURL(urlStr) {

  const myURL = new URL(urlStr);
  const host = myURL.host;
  const path = myURL.pathname;

  const pathEndsWithSlash = path.endsWith('/');

  if (pathEndsWithSlash) {
    return `${host}${path.slice(0, -1)}`;
  }


  return `${host}${path}`;

}

module.exports = {
  normalizeURL,
  getUrlsFromHTML
}
