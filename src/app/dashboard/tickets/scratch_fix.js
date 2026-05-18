
const fs = require('fs');
const content = fs.readFileSync('/Users/ab/Documents/projects/personal/tamcon_weekly_draw_lottery/src/app/dashboard/tickets/page.tsx', 'utf8');

let openBrace = 0;
let closeBrace = 0;
for (let i = 0; i < content.length; i++) {
  if (content[i] === '{') openBrace++;
  if (content[i] === '}') closeBrace++;
}

console.log(`Open: ${openBrace}, Close: ${closeBrace}`);

// Find where it goes out of sync
let level = 0;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  for (let char of lines[i]) {
    if (char === '{') level++;
    if (char === '}') level--;
  }
  if (level < 0) {
    console.log(`Sync lost at line ${i + 1}: level ${level}`);
    break;
  }
}
