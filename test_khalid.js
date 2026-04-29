async function test() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const u = "https://api.khalid-official.com/api/fbdl?url=" + encodeURIComponent(url);
  try {
     const res = await fetch(u);
     console.log(res.status, await res.text());
  } catch(e) { console.error(e) }
}
test();
