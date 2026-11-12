import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
let m;
const stack = [];

const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

while ((m = tagRegex.exec(html)) !== null) {
  const fullTag = m[0];
  const tagName = m[1].toLowerCase();
  const isClosing = fullTag.startsWith('</');
  const isSelfClosing = fullTag.endsWith('/>') || voidTags.has(tagName);

  if (isSelfClosing) continue;
  if (['script', 'style'].includes(tagName) && !isClosing) {
    // skip script/style contents
    const endTag = `</${tagName}>`;
    const endIdx = html.indexOf(endTag, m.index);
    if (endIdx !== -1) {
      tagRegex.lastIndex = endIdx + endTag.length;
      continue;
    }
  }

  if (!isClosing) {
    stack.push({ tagName, line: html.substring(0, m.index).split('\n').length, snippet: fullTag.substring(0, 50) });
  } else {
    if (stack.length === 0) {
      const line = html.substring(0, m.index).split('\n').length;
      console.error(`Extra closing tag </${tagName}> at line ${line}`);
    } else {
      const top = stack.pop();
      if (top.tagName !== tagName) {
        const line = html.substring(0, m.index).split('\n').length;
        console.error(`Tag mismatch at line ${line}: expected </${top.tagName}> (from line ${top.line}: ${top.snippet}), but got </${tagName}>`);
      }
    }
  }
}

console.log(`Total unclosed tags in entire document:`, stack.length);
stack.slice(0, 15).forEach(t => console.log(`Unclosed: <${t.tagName}> from line ${t.line}: ${t.snippet}`));

