async function test() {
  const targetUrl = 'https://www.facebook.com/share/r/1GUQtTouj7/';
  const res = await fetch(targetUrl, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log("Expanded:", res.url);
} test();
