async function test() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const u = "https://v3.fbdownloader.com/api/video?url=" + encodeURIComponent(url);
  try { console.log(await fetch(u).then(r=>r.status)); } catch(e){}
}
test();
