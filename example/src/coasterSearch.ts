import { basename } from "path";
import { UrlWithParsedQuery } from "url";
import { parse as parseDate } from "date-fns";
import { page, scrape } from "scrapegoat";

export type Args = {
  query: string;
};

export type Result = {
  id: string;
  name: string;
  opened: Date;
  hasPhotos: boolean;
  parkId: string;
  park: string;
  typeId: string;
  type: string;
  designId: string;
  design: string;
  statusId: string;
  status: string;
};

export type Results = {
  total: number;
  results: Result[];
};

export const idFromUrl = ({ pathname }: UrlWithParsedQuery): string =>
  basename(pathname);
export const idFromQuery = ({
  query: { id }
}: UrlWithParsedQuery & { query: { id: string } }): string => id;

export const coasterSearchPage = page<Args, Results>({
  url: ({ query }: Args) => ({
    protocol: "https:",
    host: "rcdb.com",
    pathname: "/r.htm",
    query: { ot: "2", na: query }
  }),
  scrape: scrape.section<Results>("main section", {
    total: scrape.int(".t-top tbody tr:nth-child(1) td:nth-child(3)"),
    results: scrape.list(
      "#report tbody tr",
      scrape.section<Result>(null, {
        id: scrape.url("td:nth-child(1) a", idFromUrl),
        name: scrape.text("td:nth-child(1)"),
        opened: scrape.attr("td:nth-child(6) time", "datetime", parseDate),
        hasPhotos: scrape.exists("td:nth-child(0) a"),
        parkId: scrape.url("td:nth-child(2) a", idFromUrl),
        park: scrape.text("td:nth-child(2) a"),
        typeId: scrape.url("td:nth-child(3) a", idFromQuery),
        type: scrape.text("td:nth-child(3) a"),
        designId: scrape.url("td:nth-child(4) a", idFromQuery),

        design: scrape.text("td:nth-child(4) a"),
        statusId: scrape.url("td:nth-child(5) a", idFromQuery),
        status: scrape.text("td:nth-child(5) a")
      })
    )
  })
});
