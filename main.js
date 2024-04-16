
// If the number of CLI arguments is less than 1, print an error and exit.
// If the number of CLI arguments is more than 1, print an error and exit.
// If we have exactly one CLI argument, it's the "baseURL", so print some kind of message letting the user know the crawler is starting at that baseURL
function main() {

  if (process.argv.length < 3) {
    console.error("Please provide a URL to crawl.")
    process.exit(1)
  }

  if (process.argv.length > 3) {
    console.error("Please provide only one URL to crawl.")
    process.exit(1)
  }

  const baseURL = process.argv[2]
  console.log(`Crawling ${baseURL}`)

}

main()
