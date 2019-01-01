import { basename } from "path";
import { UrlWithParsedQuery } from "url";
import { parse as parseDate } from "date-fns";
import {
  page,
  section,
  int,
  list,
  tuple,
  exists,
  url,
  text,
  attr
} from "../../src/";

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
  scrape: section<Results>("main section", {
    total: int(".t-top tbody tr:nth-child(1) td:nth-child(3)"),
    results: list(
      "#report tbody tr",
      tuple<Result>("td", [
        { hasPhotos: exists("a") },
        { id: url("a", idFromUrl), name: text("a") },
        { parkId: url("a", idFromUrl), park: text("a") },
        { typeId: url("a", idFromQuery), type: text("a") },
        { designId: url("a", idFromQuery), design: text("a") },
        { statusId: url("a", idFromQuery), status: text("a") },
        { opened: attr("time", "datetime", parseDate) }
      ])
    )
  })
});