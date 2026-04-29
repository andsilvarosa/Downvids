async function testManual() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  try {
     const initRes = await fetch(url, { redirect: 'follow' });
     const expandedUrl = initRes.url;
     console.log("Expanded:", expandedUrl);
     
     const res = await fetch(expandedUrl, {
       headers: {
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
       }
     });
     const html = await res.text();
     
     // Look for application/ld+json
     const jsonMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
     if (jsonMatch) {
        console.log("Found JSON-LD!");
        try {
           const data = JSON.parse(jsonMatch[1]);
           console.log("Content URL:", data.contentUrl || data.url);
        } catch(e) {
           console.log("JSON Parse failed");
        }
     } else {
        console.log("No JSON-LD found. Checking for other video tags...");
        const metaVideo = html.match(/<meta property="og:video" content="([^"]+)"/) || html.match(/<meta property="og:video:url" content="([^"]+)"/);
        if (metaVideo) {
           console.log("Meta Video:", metaVideo[1]);
        } else {
           console.log("Snippet:", html.substring(0, 500));
        }
     }
  } catch(e) { console.error(e) }
}
testManual();
