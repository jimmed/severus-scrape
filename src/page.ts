import { parse as parseHtml, HtmlElement } from "fast-html-parser";
import fetch from "node-fetch";
import { Url, urlFactory } from "./url";

export interface PageDefinition<Args extends object, Result> {
  url: string | Url | ((args: Args) => string | Url);
  scrape(dom: HtmlElement): Result;
}

export interface PageScraper<Args extends object, Result> {
  url(args: Args): string;
  fetch(args: Args): Promise<string> | string;
  scrape(args: Args): Promise<Result> | Result;
  resolve(dom: HtmlElement): Result;
}

export const page = <Args extends object, Result>({
  url,
  scrape
}: PageDefinition<Args, Result>): PageScraper<Args, Result> => ({
  url: urlFactory(url),
  async fetch(args: Args): Promise<string> {
    const url = this.url(args);
    const res = await fetch(url);
    return res.text();
  },
  async scrape(args: Args): Promise<Result> {
    return this.resolve(parseHtml(await this.fetch(args)));
  },
  resolve: scrape
});
