import { HtmlElement } from "fast-html-parser";
import { flow } from "lodash";
import { parse as parseUrl } from "url";

/**
 * Helper function for building a scraper using a single DOM node.
 * If the DOM node is not found, the handler is not called, and `null` is returned.
 *
 * @param selector The selector for the DOM node to pass to the handler
 * @param scraper A function, which given the selected DOM node returns the result of the scraping operation
 */
export const node = <Result>(
  selector: string,
  scraper: (node: HtmlElement) => Result
) => (dom: HtmlElement): Result | null => {
  const node = selector ? dom.querySelector(selector) : dom;
  return node && scraper(node);
};

/**
 * Scrape the inner text from a DOM node.
 * @param selector The selector for the DOM node.
 * @param trim Whether to trim the text (default: `true`)
 */
export const text = (selector: string, trim: boolean = true) =>
  node(selector, node => {
    const text = node.text;
    return text && trim ? text.trim() : text;
  });

export const attr = (
  selector: string,
  attribute: string,
  raw: boolean = false
) =>
  node(
    selector,
    node => node[raw ? "rawAttributes" : "attributes"][attribute] || null
  );

export const url = (selector: string) =>
  flow(
    attr(selector, "href"),
    (href: string) => parseUrl(href, true)
  );

/**
 * Scrape the inner text from a DOM node, and parse it as an integer.
 * Essentially a wrapper around `parseInt`.
 * @param selector The selector for the DOM node.
 * @param radix The radix to pass to `parseInt` (default: `10`)
 */
export const int = (selector: string, radix: number = 10) =>
  flow(
    text(selector),
    text => parseInt(text, radix)
  );

export type SectionFields<Result> = {
  [Key in keyof Result]: (dom: HtmlElement) => Result[Key]
};

/**
 * Compose together multiple scrapers using a specific DOM node.
 *
 * For example:
 *
 * ```js
 * const headerSection = scrape.section('header', {
 *   title: scrape.text('h1'),
 *   author: scrape.section('.author', {
 *     name: scrape.text('.author-name'),
 *     url: scrape.href('a.author-website')
 *   })
 * })
 * ```
 *
 * @param selector The selector for the DOM node to pass to each scraper
 * @param fields An object which maps from field name to a scraper function
 */
export const section = <Result extends { [key: string]: any }>(
  selector: string,
  fields: SectionFields<Result>
) =>
  node(
    selector,
    (dom: HtmlElement): Result =>
      // @FIXME: _.mapValues doesn't have a suitable type declaration
      Object.keys(fields).reduce(
        <K extends keyof Result>(out: Result, key: K) => ({
          ...out,
          [key]: fields[key](dom)
        }),
        {} as Result
      )
  );

/**
 * Scrape an array of DOM nodes matching a selector, using another scraper.
 * This behaves a little bit like Array.map.
 * @param selector The selector for the DOM nodes.
 * @param scraper A scraper to handle each matched node.
 */
export const list = <Result>(
  selector: string,
  scraper: (dom: HtmlElement, index: number) => Result
) => (dom: HtmlElement): Result[] =>
  dom.querySelectorAll(selector).map(scraper);

export const exists = (selector: string) => node(selector, node => true);

export const tuple = <Result>(
  selector: string,
  scrapers: Array<Partial<SectionFields<Result>> | null>
) => {
  const thisTuple = list<Partial<Result>>(selector, (node, index) =>
    scrapers[index]
      ? section<Partial<Result>>(null, scrapers[index])(node)
      : null
  );
  return (dom: HtmlElement): Result =>
    // @ts-ignore The many partials add up to a whole, but never provably
    thisTuple(dom).reduce(
      (out, partial) => ({ ...out, ...partial }),
      {} as Result
    );
};

export const table = <Result>(
  selector: string,
  rowScrapers: Array<Partial<SectionFields<Result>> | null>,
  hasBody: boolean = true
) => list(`${hasBody ? "tbody " : ""} tr`, tuple("td", rowScrapers));
