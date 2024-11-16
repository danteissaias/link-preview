export const resolveRelativeUrl = (base: URL | string, url: string) =>
  url.startsWith("https://") || url.startsWith("http://")
    ? url
    : new URL(url, base).href;
