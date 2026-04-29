const https = require('https');

async function getEndpoints() {
  const res = await fetch('https://rapidapi.com/maatootdev/api/social-media-video-downloader');
  const text = await res.text();
  const matches = text.matchAll(/\"route\"\:\"([^\"]+)\"/g);
  for (const match of matches) {
     console.log(match[1]);
  }
}
getEndpoints();
