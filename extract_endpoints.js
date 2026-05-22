import fs from 'fs';

function getEndpoints() {
  if (!fs.existsSync('rapid.html')) {
    console.log('rapid.html not found');
    return;
  }
  const text = fs.readFileSync('rapid.html', 'utf8');
  console.log('rapid.html length:', text.length);
  const matches = text.matchAll(/"route"\s*:\s*"([^"]+)"/g);
  const seen = new Set();
  for (const match of matches) {
     seen.add(match[1]);
  }
  console.log('Found route matches:', Array.from(seen));
  
  // also search for common endpoint patterns in the whole file
  const paths = text.matchAll(/"\/[^"]+"/g);
  const seenPaths = new Set();
  for (const path of paths) {
    const p = path[0].replace(/"/g, '');
    if (p.length > 2 && p.split('/').length > 2 && !p.includes('.') && !p.includes('static') && !p.includes('chunks')) {
      seenPaths.add(p);
    }
  }
  console.log('Found structured path candidates:', Array.from(seenPaths).slice(0, 50));
}
getEndpoints();
