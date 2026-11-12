import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const s4Start = html.indexOf('<div id="completeAssessmentReportContainer">');
const s4End = html.indexOf('</div> <!-- End #completeAssessmentReportContainer -->') + 50;

const containerHtml = html.substring(s4Start, s4End);

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
    const top = stack.pop();
    if (stack.length === 0) {
      console.log(`Container <${top.tagName}> from line ${top.line} was closed at line ${currentLine} by ${fullTag}`);
    }
  }
}

