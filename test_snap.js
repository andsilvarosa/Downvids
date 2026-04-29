const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
async function test() {
  const req = await fetch('https://snapvideodownloader.com/api/video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    body: JSON.stringify({ url })
  });
  console.log(req.status);
}
test();
