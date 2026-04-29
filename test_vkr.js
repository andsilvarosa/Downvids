async function test() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const u = "https://api.vkrdownloader.vercel.app/server?vkr=" + encodeURIComponent(url);
  try {
     const res = await fetch(u);
     console.log(res.status, await res.text());
  } catch(e) { console.error(e) }
}
test();
