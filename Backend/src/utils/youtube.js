const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export const parseYoutubeVideoId = (url) => {
  if (typeof url !== "string" || !url.trim()) {
    return null;
  }

  try {
    const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const parsedUrl = new URL(normalizedUrl);
    const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");
    let videoId = null;

    if (hostname === "youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v");
      } else if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/")[2];
      }
    } else if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/")[1];
    }

    return videoId && VIDEO_ID_PATTERN.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
};

export const fetchYoutubeMetadata = async (videoId) => {
  try {
    const endpoint = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`YouTube oEmbed request failed with status ${response.status}`);
    }

    const metadata = await response.json();

    return {
      title: metadata.title ?? null,
      thumbnailUrl: metadata.thumbnail_url ?? null,
    };
  } catch {
    return { title: null, thumbnailUrl: null };
  }
};