const url = "https://www.tiktok.com/@irmasbarbosaoficial/video/7612026684161887509";
const https = require('https');

async function test() {
  https.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`, { rejectUnauthorized: false }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('tiklydown', res.statusCode, data));
  }).on('error', err => console.error(err.message));
}
test();
