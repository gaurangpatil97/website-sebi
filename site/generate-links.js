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

// Sync gp-tp-links-guests/index.html
const htmlPath = path.join(__dirname, 'gp-tp-links-guests.html');
const dirPath = path.join(__dirname, 'gp-tp-links-guests');
if (fs.existsSync(htmlPath)) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  fs.copyFileSync(htmlPath, path.join(dirPath, 'index.html'));
}

// Generate static directory + index.html for each guest route so static hosting never 404s
const indexHtmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
for (const g of guests) {
  const guestDir = path.join(__dirname, g.route);
  if (!fs.existsSync(guestDir)) fs.mkdirSync(guestDir, { recursive: true });
  fs.writeFileSync(path.join(guestDir, 'index.html'), indexHtmlContent, 'utf8');
}

console.log(`Generated guest links and static route pages for ${guests.length} guests.`);
