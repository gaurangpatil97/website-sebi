const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const guestsPath = path.join(rootDir, 'guests.json');
const guests = JSON.parse(fs.readFileSync(guestsPath, 'utf8'));

const BASE_URL = 'https://janhaviharshin.com';

// Format: Name : Link
const lines = guests.map(g => `${g.name} : ${BASE_URL}/${g.route}`);

fs.writeFileSync(path.join(rootDir, 'guest_links.txt'), lines.join('\n') + '\n', 'utf8');

const mdRows = guests.map((g, i) => `| ${i + 1} | **${g.name}** | \`${g.code}\` | [\`/${g.route}\`](${BASE_URL}/${g.route}) | \`${BASE_URL}/${g.route}\` |`).join('\n');

const mdContent = `# Guest Invitation Links

> **Domain:** \`${BASE_URL}\`

---

## Quick Copy List (\`Name : Link\`)

\`\`\`text
${lines.join('\n')}
\`\`\`

---

## Guest Links Table

| # | Name | Code | Route | Full Link |
|---|------|------|-------|-----------|
${mdRows}
`;

fs.writeFileSync(path.join(rootDir, 'GUEST_LINKS.md'), mdContent, 'utf8');

// No per-guest folders needed: vercel.json rewrites every path to index.html,
// and script.js reads the guest name from the URL.

console.log(`Generated guest links for ${guests.length} guests.`);
