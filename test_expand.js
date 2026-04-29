const url = "https://vt.tiktok.com/ZS9U3ErRC/";
async function test() {
  try {
     // expand url
     const expandRes = await fetch(url, { redirect: 'follow' });
     const fullUrl = expandRes.url;
     console.log("Full URL:", fullUrl);
     
     const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(fullUrl)}`, {
       headers: { 'User-Agent': 'Mozilla/5.0' }
     });
     console.log("Tikwm code:", (await res.json()).code);
  } catch(e) {
     console.error(e);
  }
}
test();
