async function scrapeFB() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  try {
     const initRes = await fetch(url, { redirect: 'follow' });
     const finalUrl = initRes.url;
     const res = await fetch(finalUrl, {
       headers: {
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
       }
     });
     const html = await res.text();
     
     const fbcdnMatches = html.match(/https:\\\/\\\/[^\\]+\.fbcdn\.net\\\/v\\\/[a-zA-Z0-9_\-\/\\]+\.(mp4)[^"]+/g);
     if (fbcdnMatches) {
        console.log("matches:", fbcdnMatches.length);
        console.log(fbcdnMatches[0].replace(/\\/g,""));
     } else {
        const matches2 = html.match(/https(?:%3A%2F%2F|:\\\/\\\/)[a-zA-Z0-9.\-]+\.fbcdn\.net[^"']+/ig);
        const filtered = matches2 ? matches2.filter(s=>s.includes('.mp4') || s.includes('video')) : null;
        if (filtered && filtered.length > 0) {
           console.log("found:", filtered[0].replace(/\\/g,""));
        } else {
           console.log("None");
        }
     }
  } catch(e) { console.error(e) }
}
scrapeFB();
