const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

async function testRyzendesuRedirect() {
  try {
    const rPath = 'ytdl';
    const ryzUrl = `https://api.ryzendesu.vip/api/downloader/${rPath}?url=${encodeURIComponent(youtubeUrl)}`;
    console.log("Fetching original:", ryzUrl);
    
    const res = await fetch(ryzUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    
    // Extract redirect_link from HTML using regex
    const match = html.match(/var redirect_link = '([^']+)'/);
    if (match && match[1]) {
       const redirectUrl = match[1];
       console.log("Extracted Redirect URL:", redirectUrl);
       
       console.log("Fetching Redirect URL...");
       const redRes = await fetch(redirectUrl, {
         headers: { 
           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
           'Referer': ryzUrl
         }
       });
       console.log("Redirect Status:", redRes.status);
       const redText = await redRes.text();
       console.log("Redirect Response:", redText.substring(0, 500));
    } else {
       console.log("no match found in HTML:", html.substring(0, 300));
    }
  } catch(e) {
    console.error("Error path:", e.message);
  }
}

testRyzendesuRedirect();
