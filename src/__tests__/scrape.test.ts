import { parse as parseHtml } from "fast-html-parser";
import {
  node,
  text,
  attr,
  url,
  int,
  section,
  list,
  exists,
  tuple,
  table
} from "../scrape";

const html = `<html lang="en"><body><h1><a href="/hey"><span title="Hooray">Test</span></a></h1><ul><li>Foo</li><li>Bar</li><li>Baz</li></ul><p>Count: <span>3</span></p></body></html>`;

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

    describe("when called with an unmatched selector and a scraper", () => {
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

  describe("text", () => {
    it("should be a function", () => {
      expect(text).toBeInstanceOf(Function);
    });

    describe("when called with a selector", () => {
      let textInst;
      beforeEach(() => {
        textInst = text("h1");
      });

      it("should return a function", () => {
        expect(textInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = textInst(domRoot);
        });

        it("should return the text from the DOM node", () => {
          expect(result).toBe("Test");
        });
      });
    });

    describe("when called without a selector", () => {
      let textInst;
      beforeEach(() => {
        textInst = text();
      });

      it("should return a function", () => {
        expect(textInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = textInst(domRoot);
        });

        it("should return the text from the whole DOM", () => {
          expect(result).toMatchInlineSnapshot(`"TestFooBarBazCount: 3"`);
        });
      });
    });

    describe("when called with an unmatched selector", () => {
      let textInst;
      beforeEach(() => {
        textInst = text("404");
      });

      it("should return a function", () => {
        expect(textInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = textInst(domRoot);
        });

        it("should return null", () => {
          expect(result).toBe(null);
        });
      });
    });
  });

  describe("attr", () => {
    it("should be a function", () => {
      expect(attr).toBeInstanceOf(Function);
    });

    describe("when called with a selector", () => {
      let attrInst;
      beforeEach(() => {
        attrInst = attr("h1 span", "title");
      });

      it("should return a function", () => {
        expect(attrInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = attrInst(domRoot);
        });

        it("should return the attr from the DOM node", () => {
          expect(result).toBe("Hooray");
        });
      });
    });

    describe("when called without a selector", () => {
      let attrInst;
      beforeEach(() => {
        attrInst = attr(null, "lang");
      });

      it("should return a function", () => {
        expect(attrInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = attrInst(domRoot);
        });

        it("should return null", () => {
          expect(result).toBe(null);
        });
      });
    });

    describe("when called with an unmatched selector", () => {
      let attrInst;
      beforeEach(() => {
        attrInst = attr("h1", "404");
      });

      it("should return a function", () => {
        expect(attrInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = attrInst(domRoot);
        });

        it("should return null", () => {
          expect(result).toBe(null);
        });
      });
    });
  });

  describe("url", () => {
    it("should be a function", () => {
      expect(url).toBeInstanceOf(Function);
    });

    describe("when called with a selector", () => {
      let urlInst;
      beforeEach(() => {
        urlInst = url("h1 a");
      });

      it("should return a function", () => {
        expect(urlInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = urlInst(domRoot);
        });

        it("should return the url from the DOM node", () => {
          expect(result).toMatchObject({
            pathname: "/hey"
          });
        });
      });
    });

    describe("when called without a selector", () => {
      let urlInst;
      beforeEach(() => {
        urlInst = url(null);
      });

      it("should return a function", () => {
        expect(urlInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = urlInst(domRoot);
        });

        it("should return null", () => {
          expect(result).toBe(null);
        });
      });
    });

    describe("when called with an unmatched selector", () => {
      let urlInst;
      beforeEach(() => {
        urlInst = url("404");
      });

      it("should return a function", () => {
        expect(urlInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = urlInst(domRoot);
        });

        it("should return null", () => {
          expect(result).toBe(null);
        });
      });
    });
  });

  describe("int", () => {
    it("should be a function", () => {
      expect(int).toBeInstanceOf(Function);
    });

    describe("when called with a selector", () => {
      let intInst;
      beforeEach(() => {
        intInst = int("p span");
      });

      it("should return a function", () => {
        expect(intInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = intInst(domRoot);
        });

        it("should return the int from the DOM node", () => {
          expect(result).toBe(3);
        });
      });
    });

    describe("when called without a selector", () => {
      let intInst;
      beforeEach(() => {
        intInst = int();
      });

      it("should return a function", () => {
        expect(intInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = intInst(domRoot);
        });

        it("should return NaN", () => {
          expect(result).toBe(NaN);
        });
      });
    });

    describe("when called with an unmatched selector", () => {
      let intInst;
      beforeEach(() => {
        intInst = int("404");
      });

      it("should return a function", () => {
        expect(intInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = intInst(domRoot);
        });

        it("should return NaN", () => {
          expect(result).toBe(NaN);
        });
      });
    });
  });

  describe("exists", () => {
    it("should be a function", () => {
      expect(exists).toBeInstanceOf(Function);
    });

    describe("when called with a selector", () => {
      let existsInst;
      beforeEach(() => {
        existsInst = exists("h1");
      });

      it("should return a function", () => {
        expect(existsInst).toBeInstanceOf(Function);
      });

      describe("which when called", () => {
        let result;
        beforeEach(() => {
          result = existsInst(domRoot);
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });
    });

    describe("when called with a non-matching selector", () => {
      let existsInst;
      beforeEach(() => {
        existsInst = exists("404");
      });

      it("should return a function", () => {
        expect(existsInst).toBeInstanceOf(Function);
      });

      describe("which when called", () => {
        let result;
        beforeEach(() => {
          result = existsInst(domRoot);
        });

        it("should return null", () => {
          expect(result).toBe(null);
        });
      });
    });
  });

  describe("section", () => {
    let scrapers;
    beforeEach(() => {
      scrapers = Object.freeze({
        title: text("span"),
        tooltip: attr("span", "title"),
        url: attr("a", "href")
      });
    });
    it("should be a function", () => {
      expect(section).toBeInstanceOf(Function);
    });

    describe("when called with a selector", () => {
      let sectionInst;
      beforeEach(() => {
        sectionInst = section("body", scrapers);
      });

      it("should return a function", () => {
        expect(sectionInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = sectionInst(domRoot);
        });

        it("should return the section from the DOM node", () => {
          expect(result).toMatchObject({
            title: "Test",
            tooltip: "Hooray",
            url: "/hey"
          });
        });
      });
    });
  });

  describe("list", () => {
    it("should be a function", () => {
      expect(list).toBeInstanceOf(Function);
    });

    describe("when called with a selector", () => {
      let listInst, listVisitor;
      beforeEach(() => {
        listVisitor = jest.fn(text());
        listInst = list("ul li", listVisitor);
      });

      it("should be a function", () => {
        expect(listInst).toBeInstanceOf(Function);
      });

      describe("when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = listInst(domRoot);
        });

        it("should return an array of results", () => {
          expect(result).toEqual(["Foo", "Bar", "Baz"]);
        });

        it("should call the scraper for each item", () => {
          expect(listVisitor).toHaveBeenCalledTimes(3);
        });
      });
    });
  });

  describe("tuple", () => {
    it("should be a function", () => {
      expect(tuple).toBeInstanceOf(Function);
    });

    describe("when called with a selector", () => {
      let tupleInst, tupleVisitors;
      beforeEach(() => {
        tupleVisitors = [{ a: jest.fn(text()) }, null, { b: jest.fn(text()) }];
        tupleInst = tuple("ul li", tupleVisitors);
      });

      it("should be a function", () => {
        expect(tupleInst).toBeInstanceOf(Function);
      });

      describe("when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = tupleInst(domRoot);
        });

        it("should return an array of results", () => {
          expect(result).toMatchObject({ a: "Foo", b: "Baz" });
        });

        it("should call the correct scraper for each item", () => {
          expect(tupleVisitors[0].a).toHaveBeenCalled();
          expect(tupleVisitors[2].b).toHaveBeenCalled();
        });
      });
    });
  });

  describe("table", () => {
    const tableHtml = `<div><table><tbody><tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></tbody></table></div>`;
    let tableDomRoot;
    beforeEach(() => {
      tableDomRoot = parseHtml(tableHtml);
    });

    it("should be a function", () => {
      expect(table).toBeInstanceOf(Function);
    });

    describe("when called with a selector", () => {
      let tableInst, tableVisitors;
      beforeEach(() => {
        tableVisitors = [{ a: jest.fn(text()) }, { b: jest.fn(text()) }];
        tableInst = table<{ a: string; b: string }>("table", tableVisitors);
      });

      it("should return a function", () => {
        expect(tableInst).toBeInstanceOf(Function);
      });

      describe("which when called with a DOM", () => {
        let result;
        beforeEach(() => {
          result = tableInst(tableDomRoot);
        });

        it("should return the expected result", () => {
          expect(result).toEqual([{ a: "A", b: "B" }, { a: "C", b: "D" }]);
        });

        it("should call the table visitors", () => {
          expect(tableVisitors[0].a).toHaveBeenCalledTimes(2);
          expect(tableVisitors[1].b).toHaveBeenCalledTimes(2);
        });
      });
    });
  });
});
