
const fs = require('fs');
const content = fs.readFileSync('/Users/ab/Documents/projects/personal/tamcon_weekly_draw_lottery/src/app/dashboard/tickets/page.tsx', 'utf8');

const openDialog = (content.match(/<Dialog(?!\w)/g) || []).length;
const closeDialog = (content.match(/<\/Dialog>/g) || []).length;

console.log(`Dialog Open: ${openDialog}, Dialog Close: ${closeDialog}`);

const openDiv = (content.match(/<div(?!\w)/g) || []).length;
const closeDiv = (content.match(/<\/div>/g) || []).length;

console.log(`Div Open: ${openDiv}, Div Close: ${closeDiv}`);
