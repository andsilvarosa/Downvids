const fs = require('fs');
if (fs.existsSync('rapid.html')) {
  const content = fs.readFileSync('rapid.html', 'utf8');
  const regex = /\/[a-zA-Z0-9_\-\/]+/g;
  const matches = [...new Set(content.match(regex))];
  console.log(matches.filter(m => m.includes('video') || m.includes('api') || m.includes('dl') || m.includes('smvd') || m.includes('tiktok') || m.includes('download')));
}
