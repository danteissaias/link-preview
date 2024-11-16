import {
  type LinkPreviewYoutubeChannelDetails,
  type LinkPreviewYoutubeVideoDetails,
  getYoutubeChannelDetails,
  getYoutubeVideoDetails,
} from "./youtube";

export type LinkPreviewDetails =
  | LinkPreviewYoutubeVideoDetails
  | LinkPreviewYoutubeChannelDetails;

export async function getLinkPreviewDetails({
  parsedUrl,
  canonicalUrl,
}: {
  parsedUrl: URL;
  canonicalUrl?: string;
}) {
  // Youtube Video
  if (parsedUrl.href.startsWith("https://www.youtube.com/watch")) {
    const videoId = parsedUrl.searchParams.get("v");
    if (!videoId) {
      return null;
    }

    try {
      return getYoutubeVideoDetails(videoId);
    } catch {
      return null;
    }
  }

  // Youtube Channel
  if (canonicalUrl?.startsWith("https://www.youtube.com/channel/")) {
    const parsedCanonicalUrl = new URL(canonicalUrl);
    const parts = parsedCanonicalUrl.pathname.split("/");
    const channelId = parts.pop() || parts.pop(); // Handle trailing slash
    if (!channelId) {
      return null;
    }

    try {
      return getYoutubeChannelDetails(channelId);
    } catch {
      return null;
    }
  }
}
