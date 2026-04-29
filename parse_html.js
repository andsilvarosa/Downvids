const fs = require('fs');
const html = fs.readFileSync('rapid.html', 'utf8');

const regex = /(smvd|\/api\/|endpoint)[^\"]*/g;
const matches = html.match(regex);
if (matches) {
   const unique = [...new Set(matches)];
   console.log(unique.slice(0, 50).join('\n'));
} else {
   console.log("No matches found!");
}
