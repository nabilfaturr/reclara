export function extractVideoIdFromUrl(url: string): string {
  // Normalize URL - remove whitespace
  url = url.trim();

  const patterns = [
    // youtube.com/watch?v=VIDEO_ID (with or without params)
    /youtube\.com\/watch[^&]*[?&]v=([a-zA-Z0-9_-]{11})/,
    // youtu.be/VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    // Direct video ID (11 chars)
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  throw new Error(`Invalid YouTube URL or video ID: ${url}`);
}
