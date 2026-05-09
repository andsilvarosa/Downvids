const { fbdown } = require('btch-downloader');
const shadowx = require('shadowx-fbdl');

async function test() {
  const url = 'https://www.facebook.com/share/r/1GUQtTouj7/';
  
  try {
    const res = await fbdown(url);
    console.log('btch-downloader:', res);
  } catch(e) {
    console.log('btch-downloader fail', e.message);
  }

  try {
    const res2 = await shadowx.fbdl(url);
    console.log('shadowx-fbdl:', res2);
  } catch(e) {
     console.log('shadowx-fbdl fail', e.message);
  }

} test();
