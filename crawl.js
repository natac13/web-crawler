const { JSDOM } = require("jsdom");
/**
 * @param {string} htmlBody - The HTML body to extract URLs from.
 * @param {string} baseURL - The base URL to resolve relative URLs against.
 * @returns {string[]} An array of URLs found in the HTML body.
 */
function getUrlsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const aElements = dom.window.document.querySelectorAll("a");
  for (const aElement of aElements) {
    if (aElement.href.slice(0, 1) === "/") {
      try {
        urls.push(new URL(aElement.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    } else {
      try {
        urls.push(new URL(aElement.href).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    }
  }
  return urls;
}

/**
 * Normalizes a URL by removing trailing slashes from the path.
 * @param {string} urlStr - The URL to be normalized.
 * @returns {string} The normalized URL.
 */
function normalizeURL(urlStr) {
  const myURL = new URL(urlStr);
  const host = myURL.host;
  const path = myURL.pathname;

  const pathEndsWithSlash = path.endsWith("/");

  if (pathEndsWithSlash) {
    return `${host}${path.slice(0, -1)}`;
  }

  return `${host}${path}`;
}

/*
Use fetch to fetch the webpage of the currentURL
If the HTTP status code is an error-level code (400+), print an error and return
If the response content-type header is not text/html print an error and return
Otherwise, just print the HTML body as a string and be done

crawlPage will now take 3 arguments: crawlPage(baseURL, currentURL, pages)

The currentURL parameter is the current URL we're crawling. In the first call to crawlPage() this will just be a copy of the baseURL, but as we make further fetch requests to all the URLs we find on the baseURL, the currentURL value will change while the base stays the same.

The pages object will be used to keep track of the number of times we've seen each internal link. This function needs to always return an updated version of this object.

HERE'S MY PSEUDO CODE FOR THE NEW CRAWLPAGE
1. Make sure the currentURL is on the same domain as the baseURL. If it's not, just return the current pages. We don't want to crawl the entire internet, just the domain in question.
2. Get a normalized version of the currentURL.
3. If the pages object already has an entry for the normalized version of the current URL, just increment the count and return the current pages.
4. Otherwise, add an entry to the pages object for the normalized version of the current URL, and set the count to 1.
5. If we've gotten here, we haven't yet made a request to the current URL, so let's do that, and maybe add a console.log so you can watch your crawler go in real-time.
6. Assuming all went well with the fetch request, get all the URLs from the response body HTML
7. Recursively crawl each URL you found on the page and update the pages to keep an aggregate count
8. Finally, return the updated pages object
*/
async function crawlPage(baseURL, currentURL, pages) {
  const baseHost = new URL(baseURL).host;
  const currentHost = new URL(currentURL).host;

  if (baseHost !== currentHost) {
    return pages;
  }

  const normalizedURL = normalizeURL(currentURL);

  if (pages[normalizedURL]) {
    pages[normalizedURL] = pages[normalizedURL] + 1;
  } else {
    pages[normalizedURL] = 1;
    console.log(`\nCrawling page with URL: ${currentURL}`);

    try {
      const response = await fetch(currentURL);
      if (!response.ok) {
        console.error(`Failed to fetch ${currentURL}: ${response.statusText}`);
        throw new Error(
          `Failed to fetch ${currentURL}: ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType.includes("text/html")) {
        console.log(`Skipping ${currentURL}: not an HTML page`);
      } else {
        const text = await response.text();
        const otherPages = getUrlsFromHTML(text, currentURL);

        for await (const page of otherPages) {
          pages = await crawlPage(baseURL, page, pages); // Pass the updated 'pages' object to the recursive call
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${currentURL}: ${err.message}`);
      throw new Error(`Failed to fetch ${currentURL}: ${err.message}`);
    }
  }

  return pages;
}

module.exports = {
  normalizeURL,
  getUrlsFromHTML,
  crawlPage,
};
