import fetch from 'node-fetch';

async function testLib() {
  try {
     const url = 'https://www.facebook.com/share/v/18qSkTTRsD/';
     const htmlRes = await fetch('https://fdown.net/download.php', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'User-Agent': 'Mozilla/5.0'
       },
       body: 'URLz=' + encodeURIComponent(url)
     });
     console.log(htmlRes.status);
     const text = await htmlRes.text();
     const hd = text.match(/href="([^"]+)" id="hdlink"/);
     const sd = text.match(/href="([^"]+)" id="sdlink"/);
     console.log('HD:', hd ? hd[1] : null);
     console.log('SD:', sd ? sd[1] : null);
  } catch(e) { console.error(e) }
}
testLib();
