
const igUrl = encodeURIComponent('https://www.instagram.com/reel/DYDFbkBvDk2/');
const ytUrl = encodeURIComponent('https://youtube.com/shorts/d7gV3DpwVgg');

const igApis = [
  'https://api.agatz.xyz/api/instagram?url=',
  'https://api.nyxs.pw/dl/ig?url=',
  'https://aemt.me/igdl?url=',
  'https://api.diioffc.web.id/api/download/instagram?url='
];

const ytApis = [
  'https://api.khalid-official.com/api/ytmp4?url=',
  'https://saipulanuar.my.id/api/download/ytmp4?url=',
  'https://api.siputzx.my.id/api/d/youtube?url=',
  'https://itzpire.site/download/youtube?url=',
  'https://api.zenon.my.id/api/download/ytmp4?url='
];

async function test() {
  console.log('--- TESTING INSTAGRAM ---');
  for (const url of igApis) {
    try {
      const res = await fetch(url + igUrl);
      const text = await res.text();
      console.log(`\nURL: ${url} -> Status: ${res.status}`);
      console.log(`Response: ${text.substring(0, 200)}...`);
    } catch (e) {
      console.log(`URL: ${url} -> ERROR: ${e.message}`);
    }
  }

  console.log('\n--- TESTING YOUTUBE ---');
  for (const url of ytApis) {
    try {
      const res = await fetch(url + ytUrl);
      const text = await res.text();
      console.log(`\nURL: ${url} -> Status: ${res.status}`);
      console.log(`Response: ${text.substring(0, 200)}...`);
    } catch (e) {
      console.log(`URL: ${url} -> ERROR: ${e.message}`);
    }
  }
}

test();
