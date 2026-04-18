import { extractUrls, detectPlatform } from './url-parser';

export function isValidMediaUrl(text: string): boolean {
  const urls = extractUrls(text);
  if (urls.length === 0) return false;
  
  const platform = detectPlatform(urls[0]);
  return platform !== 'unknown';
}
