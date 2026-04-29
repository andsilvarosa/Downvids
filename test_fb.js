const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
async function test() {
  const fdownUrl = `https://fdownloader.net/api/ajaxSearch`;
  const res = await fetch(fdownUrl, {
     method: 'POST',
     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
     body: `k_exp=12345&q=${encodeURIComponent(url)}&v=v2`
  });
  console.log("FDownloader:", res.status);
  if(res.status == 200) console.log(await res.text());
}
test();
