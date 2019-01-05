import { UrlObject as Url, format as formatUrl } from "url";
import { flow } from "lodash";
export { Url } from "url";

export const urlFactoryFromString = (url: string) => () => url;
export const urlFactoryFromObject = flow(
  formatUrl,
  urlFactoryFromString
);

export const urlFactoryFromFunction = <A>(
  factory: (args: A) => Url | string
) => (args: A) => {
  const url = factory(args);
  if (typeof url === "string") return url;
  return formatUrl(url);
};

export const urlFactory = <A = undefined>(
  url: string | Url | ((args: A) => string | Url)
) => {
  switch (typeof url) {
    case "string":
      return urlFactoryFromString(url);
    case "function":
      return urlFactoryFromFunction<A>(url);
    case "object":
      return urlFactoryFromObject(url);
    default:
      throw new Error(`Unable to create URL factory from a ${typeof url}`);
  }
};
