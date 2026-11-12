import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const s4Start = html.indexOf('<section class="module-panel" id="step-4"');
const s4End = html.indexOf('</section>', s4Start) + 10;
const s4 = html.substring(s4Start, s4End);

const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
let m;
const stack = [];
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

while ((m = tagRegex.exec(s4)) !== null) {
  const fullTag = m[0];
  const tagName = m[1].toLowerCase();
  const isClosing = fullTag.startsWith('</');
  const isSelfClosing = fullTag.endsWith('/>') || voidTags.has(tagName);
  if (isSelfClosing) continue;

  if (!isClosing) {
    stack.push({ tagName, index: m.index, snippet: fullTag.substring(0, 40) });
  } else {
    if (stack.length === 0) {
      console.error(`Extra closing </${tagName}> at offset ${m.index} in s4`);
    } else {
      const top = stack.pop();
      if (top.tagName !== tagName) {
        console.error(`Mismatch in s4: expected </${top.tagName}> (${top.snippet}), got </${tagName}> at ${m.index}`);
      }
    }
  }
}
console.log('Unclosed tags in s4:', stack.length);
stack.forEach(t => console.log('Unclosed in s4:', t.tagName, t.snippet));

