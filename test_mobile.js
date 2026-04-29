async function testMobileScrape() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  try {
     const initRes = await fetch(url, { redirect: 'follow' });
     const expandedUrl = initRes.url;
     const mobileUrl = expandedUrl.replace("www.facebook.com", "m.facebook.com");
     console.log("Mobile URL:", mobileUrl);
     
     const res = await fetch(mobileUrl, {
       headers: {
         'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
         'sec-fetch-dest': 'document',
         'sec-fetch-mode': 'navigate',
         'sec-fetch-site': 'none',
         'sec-fetch-user': '?1',
         'upgrade-insecure-requests': '1'
       }
     });
     const html = await res.text();
     
     // Look for video links in mobile HTML
     const sd = html.match(/sd_src:"([^"]+)"/) || html.match(/"sd_src":"([^"]+)"/);
     const hd = html.match(/hd_src:"([^"]+)"/) || html.match(/"hd_src":"([^"]+)"/);
     const videoSrc = html.match(/<video[^>]*src="([^"]+)"/);
     
     const de = (s) => s ? s.replace(/\\/g, '') : null;
     
     if (sd) console.log("SD:", de(sd[1]));
     if (hd) console.log("HD:", de(hd[1]));
     if (videoSrc) console.log("Video Tag Src:", de(videoSrc[1]));
     
     if (!sd && !hd && !videoSrc) {
        console.log("Still nothing. HTML Length:", html.length);
        // Try to find any fbcdn link with mp4
        const fbcdn = html.match(/https:\\\/\\\/[^\\]+\.fbcdn\.net[^\s"']+\.mp4[^\s"']+/g);
        if (fbcdn) {
           console.log("Found fbcdn mp4:", de(fbcdn[0]));
        } else {
           console.log("Snippet:", html.substring(0, 500));
        }
     }
  } catch(e) { console.error(e) }
}
testMobileScrape();
