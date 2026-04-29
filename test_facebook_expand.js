const targetUrl = "https://www.facebook.com/share/v/18qSkTTRsD/";

async function test() {
  try {
     const res = await fetch(targetUrl, { redirect: 'follow' });
     console.log("Expanded:", res.url);
  } catch(e) {
     console.error(e);
  }
}
test();
