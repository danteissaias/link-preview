import { parse } from "node-html-parser";

import { type LinkPreviewDetails, getLinkPreviewDetails } from "./details";
import { resolveRelativeUrl } from "./utils";

export interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
  details?: LinkPreviewDetails;
}

export async function getLinkPreview(query: string): Promise<LinkPreview> {
  const res = await fetch(query, {
    redirect: "follow",
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "Bot",
    },
  });

  if (res.status >= 400) {
    throw new Error(`Link preview failed with status ${res.status}`);
  }

  if (!res.headers.get("content-type")?.startsWith("text/html")) {
    throw new Error("Only HTML responses are supported");
  }

  const body = await res.text();

  const parsedBody = parse(body);
  const parsedUrl = new URL(res.url);

  const $ = (q: string) => parsedBody.querySelector(q);
  const meta = (name: string) =>
    $(`meta[property="${name}"]`)?.getAttribute("content");

  const title =
    meta("og:title") || meta("twitter:title") || $("title")?.textContent;

  const description =
    meta("og:description") ||
    meta("twitter:description") ||
    $("meta[name=description]")?.getAttribute("content");

  const canonicalUrlTag =
    $('link[rel="canonical"]')?.getAttribute("href") || meta("og:url");
  const canonicalUrl = canonicalUrlTag
    ? resolveRelativeUrl(parsedUrl, canonicalUrlTag)
    : undefined;
  const url = canonicalUrl || parsedUrl.href;

  const ogImage = meta("og:image") || meta("twitter:image");
  const image = ogImage ? resolveRelativeUrl(parsedUrl, ogImage) : undefined;

  const icon =
    $("link[rel=icon]")?.getAttribute("href") ||
    $('link[rel="shortcut icon"]')?.getAttribute("href");

  const linkPreview: LinkPreview = {
    title,
    description,
    url,
    image,
    icon,
  };

  const details = await getLinkPreviewDetails({ parsedUrl, canonicalUrl });

  if (details) {
    linkPreview.details = details;
  }

  return linkPreview;
}
