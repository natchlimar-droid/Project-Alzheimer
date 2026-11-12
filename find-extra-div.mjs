import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const s4Start = html.indexOf('<div id="completeAssessmentReportContainer">');
const s4End = html.indexOf('</div> <!-- End #completeAssessmentReportContainer -->') + 50;

const containerHtml = html.substring(s4Start, s4End);
const lines = html.substring(0, s4Start).split('\n');
const startLine = lines.length;

const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
let m;
const stack = [];
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

while ((m = tagRegex.exec(containerHtml)) !== null) {
  const fullTag = m[0];
  const tagName = m[1].toLowerCase();
  const isClosing = fullTag.startsWith('</');
  const isSelfClosing = fullTag.endsWith('/>') || voidTags.has(tagName);
  if (isSelfClosing) continue;

  const currentLine = html.substring(0, s4Start + m.index).split('\n').length;

  if (!isClosing) {
    stack.push({ tagName, line: currentLine, snippet: fullTag.substring(0, 50) });
  } else {
    if (stack.length === 0) {
      console.error(`EXTRA CLOSING TAG </${tagName}> at line ${currentLine}: ${fullTag}`);
    } else {
      const top = stack.pop();
      if (top.tagName !== tagName) {
        console.error(`Mismatch at line ${currentLine}: expected </${top.tagName}> (from line ${top.line}: ${top.snippet}), got </${tagName}>`);
        // put top back
        stack.push(top);
      }
    }
  }
}

console.log('Finished checking containerHtml. Remaining in stack:', stack.length);
stack.forEach(t => console.log('Remaining:', t.tagName, 'line:', t.line, t.snippet));

