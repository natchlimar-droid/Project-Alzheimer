import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const s4Start = html.indexOf('<section class="module-panel" id="step-4"');
console.log(html.substring(s4Start + 65800, s4Start + 66000));

