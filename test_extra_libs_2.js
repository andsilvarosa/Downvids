
const { igdl } = require('ruhend-scraper');
const { youtube } = require('btch-downloader');

async function test() {
  const igUrl = 'https://www.instagram.com/reel/DYDFbkBvDk2/';
  const ytUrl = 'https://youtube.com/shorts/d7gV3DpwVgg';

  console.log('--- ruhend-scraper igdl ---');
  try {
    const res = await igdl(igUrl);
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.log('Fail:', e.message);
  }

  console.log('\n--- btch-downloader youtube ---');
  try {
    const res = await youtube(ytUrl);
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.log('Fail:', e.message);
  }
}

test();
