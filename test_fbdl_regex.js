const url = 'https://www.facebook.com/share/r/1GUQtTouj7/';
async function test() {
  const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const mp4Matches = html.match(/https:\\\/\\\/[^"]+\.mp4[^"]+/g);
  if (mp4Matches) {
      console.log('Found MP4 links:');
      console.log(mp4Matches.slice(0, 3));
  } else {
      const mp4Matches2 = html.match(/https:\/\/[^"]+\.mp4[^"]+/g);
      if (mp4Matches2) {
          console.log('Found MP4 links normal:');
          console.log(mp4Matches2.slice(0, 3));
      } else {
          console.log("No MP4 found.");
      }
  }
} test();
