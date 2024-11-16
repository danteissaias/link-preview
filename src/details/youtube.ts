import { youtube } from "@googleapis/youtube";

const { GOOGLE_API_KEY } = process.env;

const youtubeClient = youtube({
  version: "v3",
  auth: GOOGLE_API_KEY,
});

export interface LinkPreviewYoutubeVideoDetails {
  type: "youtube.video";
  videoId: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  publishedAt: string;
}

export async function getYoutubeVideoDetails(
  videoId: string,
): Promise<LinkPreviewYoutubeVideoDetails> {
  const videos = await youtubeClient.videos.list({
    id: [videoId],
    part: ["contentDetails", "statistics", "snippet"],
  });

  if (!videos.data.items || videos.data.items.length === 0) {
    throw new Error(`No video found with ID ${videoId}`);
  }

  const video = videos.data.items[0];

  if (!video.contentDetails || !video.statistics || !video.snippet) {
    throw new Error(`Video ${videoId} is missing required fields`);
  }

  const { duration } = video.contentDetails;
  const { viewCount, likeCount, commentCount } = video.statistics;
  const { publishedAt } = video.snippet;

  if (!duration || !viewCount || !likeCount || !commentCount || !publishedAt) {
    throw new Error(`Video ${videoId} is missing required fields`);
  }

  return {
    type: "youtube.video",
    videoId,
    duration,
    viewCount,
    likeCount,
    commentCount,
    publishedAt,
  };
}

export interface LinkPreviewYoutubeChannelDetails {
  type: "youtube.channel";
  title: string;
  description: string;
  subscriberCount: string;
  videoCount: string;
}

export async function getYoutubeChannelDetails(
  channelId: string,
): Promise<LinkPreviewYoutubeChannelDetails> {
  const channels = await youtubeClient.channels.list({
    id: [channelId],
    part: ["statistics", "snippet"],
  });

  if (!channels.data.items || channels.data.items.length === 0) {
    throw new Error(`No channel found with ID ${channelId}`);
  }

  const channel = channels.data.items[0];

  if (!channel.statistics || !channel.snippet) {
    throw new Error(`Channel ${channelId} is missing required fields`);
  }

  const { subscriberCount, videoCount } = channel.statistics;
  const { title, description } = channel.snippet;

  if (!subscriberCount || !videoCount || !title || !description) {
    throw new Error(`Channel ${channelId} is missing required fields`);
  }

  return {
    type: "youtube.channel",
    title,
    description,
    subscriberCount,
    videoCount,
  };
}
