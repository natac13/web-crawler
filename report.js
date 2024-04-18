// Let's add a printReport(pages) function to a new file called report.js. The purpose of this function is to convert the pages object into something that looks good and can be logged to the console.

// Print that the report is starting
// Sort the pages so that pages with the largest number of inbound internal links are first
// Print each page in a nice, formatted way. Something like: Found ${count} internal links to ${url}

function printReport(pages) {
  console.log("Starting report...");
  const sortedPages = sortPages(pages);
  for (const [url, count] of sortedPages) {
    console.log(`Found ${count} internal links to ${url}`);
  }
}

function sortPages(pages) {
  return Object.entries(pages).sort((a, b) => b[1] - a[1]);
}

module.exports = { printReport };
