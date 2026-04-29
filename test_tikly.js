const url = "https://vt.tiktok.com/ZS9U3ErRC/";
async function test() {
  try {
     const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${url}`, {
       headers: { 'User-Agent': 'Mozilla/5.0' }
     });
     console.log("Tiklydown:", res.status, await res.text());
  } catch(e) { console.error(e) }
}
test();
