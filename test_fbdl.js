const FBDL = require('fbdl-core');
async function test() {
  try {
    const res = await FBDL.getInfo('https://www.facebook.com/thiagonunes.nunes.750/videos/2030768627856790');
    console.log(res);
  } catch(e) {
    console.log("Error", e);
  }
} test();
