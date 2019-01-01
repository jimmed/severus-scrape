# scrapegoat

Make a GraphQL API from a website using scrapers

## Features

 - Declarative setup
 - Sensible defaults, much configurability

## Example Usage

```ts
/* scrapers/coaster.ts */
import { scraper, fromParam } from 'scrapegoat'

export const coasterPageScraper = scraper({
 url: ({ id }) => `https://rcdb.com/${id}.htm`,
 mainSelector: 'main #article div',
 fields: {
   id: fromParam(({ id }) => id),
   title: '#feature h1',
   parkId: '#feature a'
 }
})
```
