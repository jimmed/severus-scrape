# scrapegoat <🐐/>

A library for building powerful website scrapers, using a declarative, functional approach.

## Motivations

There are myriad websites which offer access to useful data, but do not offer an API.
In the case that one does not exist, and the terms of service of the website do not expressly forbid it,
building a scraper isn't a particularly difficult thing to do. It is, however, a laborious and repetitious task.

By providing a reusable library with enough functionality to express most common scraper behaviours,
it becomes completely trivial to write a scraper for most websites.

## [Full Documentation](https://scrapegoat.surge.sh/)

## Example Usage

```js
import { page, list, section, url, text } from "scrapegoat";

const getIdFromPostUrl = ({ routename }) => {
  const [, routeId] = routename.match(/^\/posts\/(\d+)/) || [];
  return routeId ? parseInt(routeId, 10) : null;
};

export const indexPage = page({
  url: `https://imaginary.blog`,
  scrape: list(
    ".blog-post",
    section(null, {
      id: url("header h2 a", getIdFromPostUrl),
      title: text("header h2 a"),
      summary: text("article")
    })
  )
});
```
