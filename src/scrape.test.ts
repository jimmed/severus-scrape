import { parse as parseHtml } from "fast-html-parser";
import { node } from "./scrape";

const html = `<html><body><h1>Test</h1><ul><li>Foo</li><li>Bar</li><li>Baz</li></ul></body></html>`;

describe("scraper factories", () => {
  let domRoot;
  beforeEach(() => {
    domRoot = parseHtml(html);
  });

  describe("node", () => {
    it("should be a function", () => {
      expect(node).toBeInstanceOf(Function);
    });

    describe("when called with a valid selector and a scraper", () => {
      let nodeInst, scraper;
      beforeEach(() => {
        scraper = jest.fn(el => el.text);
        nodeInst = node<string>("h1", scraper);
      });
      it("should return a function", () => {
        expect(nodeInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = nodeInst(domRoot);
        });

        it("should call the scraper", () => {
          // TODO: Validate correct thing is passed
          expect(scraper).toHaveBeenCalledWith(
            expect.objectContaining({
              rawText: "Test"
            })
          );
        });

        it("should return the scrape result", () => {
          expect(result).toBe("Test");
        });
      });
    });

    describe("when called with an invalid selector and a scraper", () => {
      let nodeInst, scraper;
      beforeEach(() => {
        scraper = jest.fn(() => "Test");
        nodeInst = node("404", scraper);
      });
      it("should return a function", () => {
        expect(nodeInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = nodeInst(domRoot);
        });

        it("should not call the scraper", () => {
          expect(scraper).not.toHaveBeenCalled();
        });

        it("should return null", () => {
          expect(result).toEqual(null);
        });
      });
    });
  });
});
