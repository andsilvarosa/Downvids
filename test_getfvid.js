import fetch from 'node-fetch';
async function testLib() {
  try {
     const url = 'https://www.facebook.com/share/v/18qSkTTRsD/';
     const htmlRes = await fetch('https://www.getfvid.com/downloader', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'User-Agent': 'Mozilla/5.0'
       },
       body: 'url=' + encodeURIComponent(url)
     });
     console.log(htmlRes.status);
     const text = await htmlRes.text();
     const links = text.match(/<a href="([^"]+)"/g);
     console.log(links ? links.slice(0, 5) : null);
  } catch(e) { console.error(e) }
}
testLib();
