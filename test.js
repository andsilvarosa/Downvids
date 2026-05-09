import fs from 'fs';
console.log(fs.readFileSync('node_modules/btch-downloader/build/index.js', 'utf8').substring(0, 500));
