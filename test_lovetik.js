const url = "https://www.tiktok.com/@irmasbarbosaoficial/video/7612026684161887509";
async function test() {
  const req = await fetch('https://lovetik.com/api/ajax/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'User-Agent': 'Mozilla/5.0' },
    body: `query=${encodeURIComponent(url)}`
  });
  console.log(req.status, await req.text());
}
test();
