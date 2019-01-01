import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { Url, urlFactory } from "./url";

export interface PageDefinition<A extends object, R extends object> {
  url: string | Url | ((args: A) => string | Url);
  scrape(dom: Cheerio): R;
}

export interface Page<A extends object, R extends object> {
  url(args: A): string;
  fetch(args: A): Promise<string> | string;
  scrape(args: A): Promise<R> | R;
  resolve(dom: Cheerio): R;
}

export const page = <A extends object, R extends object>({
  url,
  scrape
}: PageDefinition<A, R>): Page<A, R> => ({
  url: urlFactory(url),
  async fetch(args: A): Promise<string> {
    const url = this.url(args);
    console.log({ url, args });
    const res = await fetch(url);
    return res.text();
  },
  async scrape(args: A): Promise<R> {
    const html = await this.fetch(args);
    const dom = cheerio.load(html);
    return this.resolve(dom);
  },
  resolve: scrape
});
