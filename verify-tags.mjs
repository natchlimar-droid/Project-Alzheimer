import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const s0Start = html.indexOf('<section class="module-panel active" id="step-0"');
const s0End = html.indexOf('</section>', s0Start) + 10;

console.log('step-0 start:', s0Start, 'end:', s0End);
const step0 = html.substring(s0Start, s0End);

// Check div balance in step0
let divBalance = 0;
const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
let m;
const stack = [];

while ((m = tagRegex.exec(step0)) !== null) {
  const fullTag = m[0];
  const tagName = m[1].toLowerCase();
  const isClosing = fullTag.startsWith('</');
  const isSelfClosing = fullTag.endsWith('/>') || ['input', 'img', 'br', 'hr', 'meta', 'link'].includes(tagName);

  if (isSelfClosing) continue;

  if (!isClosing) {
    stack.push({ tagName, index: m.index, snippet: fullTag.substring(0, 40) });
  } else {
    if (stack.length === 0) {
      console.error(`Extra closing tag </${tagName}> at index ${m.index}`);
    } else {
      const top = stack.pop();
      if (top.tagName !== tagName) {
        console.error(`Tag mismatch at ${m.index}: expected </${top.tagName}> (from index ${top.index}: ${top.snippet}), but got </${tagName}>`);
      }
    }
  }
}

console.log(`Unclosed tags in step-0:`, stack.length);
stack.forEach(t => console.log(`Unclosed: <${t.tagName}> at ${t.index}: ${t.snippet}`));

