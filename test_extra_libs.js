
const { instagram, youtube } = require('ruhend-scraper');
const snapsave = require('snapsave-media-downloader');

async function test() {
  const igUrl = 'https://www.instagram.com/reel/DYDFbkBvDk2/';
  const ytUrl = 'https://youtube.com/shorts/d7gV3DpwVgg';

  console.log('--- ruhend-scraper Instagram ---');
  try {
    const res = await instagram(igUrl);
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.log('Fail:', e.message);
  }

  console.log('\n--- ruhend-scraper YouTube ---');
  try {
    const res = await youtube(ytUrl);
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.log('Fail:', e.message);
  }

  console.log('\n--- snapsave-media-downloader Instagram ---');
  try {
    const res = await snapsave(igUrl);
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.log('Fail:', e.message);
  }
}

test();
