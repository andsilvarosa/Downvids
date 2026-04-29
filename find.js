const fs = require('fs');
if (fs.existsSync('rapid.html')) {
  const content = fs.readFileSync('rapid.html', 'utf8');
  const matches = content.match(/[\"']\/([A-Za-z0-9_/-]+)[\"']/g);
  if (matches) {
     const unq = [...new Set(matches.map(s => s.replace(/[\"']/g, '')))];
     console.log(unq.filter(s => s.includes('video') || s.includes('dl') || s.includes('down')));
  } else {
     console.log('No matches');
  }
} else {
  console.log('rapid.html not found');
}
