import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const onclickMatches = [...html.matchAll(/onclick="([^"]+)"/g)].map(m => m[1]);

const fnCalls = new Set();
for (const raw of onclickMatches) {
  const parts = raw.split(';').map(p => p.trim()).filter(Boolean);
  for (const part of parts) {
    const fnName = part.split('(')[0].trim();
    if (fnName && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(fnName) && fnName !== 'if' && fnName !== 'const' && fnName !== 'let') {
      fnCalls.add(fnName);
    }
  }
}

const missing = [];
for (const fn of fnCalls) {
  const defRegex = new RegExp(`(?:function\\s+${fn}\\s*\\(|window\\.${fn}\\s*=|const\\s+${fn}\\s*=\\s*\\(|let\\s+${fn}\\s*=\\s*\\()`);
  if (!defRegex.test(html)) {
    missing.push(fn);
  }
}

console.log('Checked', fnCalls.size, 'unique onclick function calls. Missing:', missing);
