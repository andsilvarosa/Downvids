export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

export function detectPlatform(url: string): string {
  const lowUrl = url.toLowerCase();
  if (lowUrl.includes('youtube.com') || lowUrl.includes('youtu.be')) return 'youtube';
  if (lowUrl.includes('tiktok.com')) return 'tiktok';
  if (lowUrl.includes('instagram.com') || lowUrl.includes('instagr.am')) return 'instagram';
  if (lowUrl.includes('twitter.com') || lowUrl.includes('x.com')) return 'twitter';
  if (lowUrl.includes('facebook.com') || lowUrl.includes('fb.watch') || lowUrl.includes('fb.com')) return 'facebook';
  return 'unknown';
}
