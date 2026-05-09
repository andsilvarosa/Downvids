const apis = [
  'https://api.khalid-official.com/api/fbdl?url=',
  'https://saipulanuar.my.id/api/download/facebook?url=',
  'https://api.diioffc.web.id/api/download/facebook?url=',
  'https://api.miftahganzz.my.id/api/download/facebook?url='
];
const fbUrl = encodeURIComponent('https://www.facebook.com/share/r/1GUQtTouj7/');
async function test() {
  for (const url of apis) {
    try {
      const res = await fetch(url + fbUrl);
      console.log(`\n--- ${url} [${res.status}] ---`);
      console.log(await res.text());
    } catch(e) {
      console.log(`\n--- ${url} [ERROR] ---`, e.message);
    }
  }
} test();
