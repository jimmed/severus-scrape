import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { Url, urlFactory } from "./url";

export interface PageDefinition<Args extends object, Result extends object> {
  url: string | Url | ((args: Args) => string | Url);
  scrape(dom: Cheerio): Result;
}

export interface PageScraper<Args extends object, Result extends object> {
  url(args: Args): string;
  fetch(args: Args): Promise<string> | string;
  scrape(args: Args): Promise<Result> | Result;
  resolve(dom: Cheerio): Result;
}

export const page = <Args extends object, Result extends object>({
  url,
  scrape
}: PageDefinition<Args, Result>): PageScraper<Args, Result> => ({
  url: urlFactory(url),
  async fetch(args: Args): Promise<string> {
    const url = this.url(args);
    console.log({ url, args });
    const res = await fetch(url);
    return res.text();
  },
  async scrape(args: Args): Promise<Result> {
    const html = await this.fetch(args);
    const dom = cheerio.load(html);
    return this.resolve(dom);
  },
  resolve: scrape
});
