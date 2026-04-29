import https from 'https';
const url = "https://rapidapi.com/maatooh-oGbzXy-W18T/api/social-media-video-downloader";
https.get(url, (res) => {
  let d = '';
  res.on('data', chunk => d += chunk);
  res.on('end', () => console.log(d.substring(0, 500)));
});
