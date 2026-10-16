const fs = require('fs');
const path = require('path');

const guestsPath = path.join(__dirname, '..', 'guests.json');
const guests = JSON.parse(fs.readFileSync(guestsPath, 'utf8'));

const BASE_URL = 'https://janhaviharshin.com';

// Format: Name : Link
const lines = guests.map(g => `${g.name} : ${BASE_URL}/${g.route}`);

fs.writeFileSync(path.join(__dirname, '..', 'guest_links.txt'), lines.join('\n') + '\n', 'utf8');

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

fs.writeFileSync(path.join(__dirname, '..', 'GUEST_LINKS.md'), mdContent, 'utf8');

const htmlPath = path.join(__dirname, 'gp-tp-links-guests.html');
const dirPath = path.join(__dirname, 'gp-tp-links-guests');
if (fs.existsSync(htmlPath)) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  fs.copyFileSync(htmlPath, path.join(dirPath, 'index.html'));
}

console.log(`Generated guest links for ${guests.length} guests with domain ${BASE_URL}.`);
