// Type definitions for fast-html-parser@1.0.1
// Project: fast-html-parser
// Definitions by: Jim O'Brien <https://github.com/jimmed>

declare module "fast-html-parser" {
  export function parse(
    data: string,
    options?: FastHtmlParserOptions
  ): HtmlElement;

  export interface FastHtmlParserOptions {
    /* convert tag name to lower case (hurt performance heavily) */
    lowerCaseTagName?: boolean;

    /* retrieve content in <script> (hurt performance slightly) */
    script?: boolean;

    /* retrieve content in <style> (hurt performance slightly) */
    style?: boolean;

    /* retrieve content in <pre> (hurt performance slightly) */
    pre?: boolean;
  }

  export interface HtmlElement {
    text: string;
    structuredText: string;
    trimRight(pattern: RegExp): string;
    structure: string;
    removeWhitespace(): string;
    querySelectorAll(selector: string): HtmlElement[];
    querySelector(selector: string): HtmlElement | null;
    appendChild(node: HtmlElement): HtmlElement;
    firstChild(): HtmlElement;
    lastChild(): HtmlElement;
    attributes: { [key: string]: string };
    rawAttributes: { [key: string]: string };

    tagName: string;
    rawText: string;
    rawAttrs: string;
    childNodes: HtmlElement[];
    classNames: string[];
  }
}
