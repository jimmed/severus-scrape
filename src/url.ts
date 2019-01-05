import { UrlObject as Url, format as formatUrl } from "url";
export { Url } from "url";

export const urlFactoryFromFunction = <A>(
  factory: (args: A) => Url | string
) => (args: A) => {
  const url = factory(args);
  if (typeof url === "string") return url;
  return formatUrl(url);
};

export const urlFactoryFromObject = (object: Url) => {
  const url = formatUrl(object);
  return () => url;
};

export const urlFactory = <A = undefined>(
  url: string | Url | ((args: A) => string | Url)
) => {
  switch (typeof url) {
    case "string":
      return () => url;
    case "function":
      return urlFactoryFromFunction<A>(url);
    case "object":
      return urlFactoryFromObject(url);
    default:
      throw new Error(`Unable to create URL factory from a ${typeof url}`);
  }
};
