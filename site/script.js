// ─── Guest list ───────────────────────────────────────────
// Link format: yourdomain.com/<code>  →  name shown in the letter
// Unknown or missing codes show "Dear friend,"
const GUESTS = {
  'k7q-tanvi': 'Tanvi',
  'm2x-rohan': 'Rohan',
};

// Countdown target: 31 Oct 2026, 6:30 PM Pacific (= 1 Nov 01:30 UTC)
const PARTY_START = Date.UTC(2026, 10, 1, 1, 30);

// Set to false to turn off falling confetti on the cover
const CONFETTI = true;

// Paste your Google Apps Script web-app URL here (see wishes-sheet.gs)
const WISHES_URL = '';

// ─── Guest name from URL ──────────────────────────────────
const slug = decodeURIComponent(location.pathname.split('/').filter(Boolean).pop() || '').toLowerCase();
const guestName = GUESTS[slug] || 'friend';
document.getElementById('guest-name').textContent = guestName;

// ─── Leave a wish ─────────────────────────────────────────
const wishForm = document.getElementById('wish-form');
const wishText = document.getElementById('wish-text');
const wishBtn = document.getElementById('wish-btn');
document.getElementById('wish-name').textContent = guestName;
document.getElementById('wish-thanks-name').textContent = guestName;
wishText.addEventListener('input', () => { wishBtn.disabled = !wishText.value.trim(); });
wishForm.addEventListener('submit', async e => {
  e.preventDefault();
  const wish = wishText.value.trim();
  if (!wish) return;
  wishBtn.disabled = true; wishBtn.textContent = 'SENDING…';
  document.getElementById('wish-error').hidden = true;
  try {
    if (WISHES_URL) await fetch(WISHES_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams({ code: slug, name: guestName, wish }) });
    wishForm.hidden = true;
    document.getElementById('wish-thanks').hidden = false;
  } catch (err) {
    wishBtn.disabled = false; wishBtn.textContent = 'SEND WISH ♡';
    document.getElementById('wish-error').hidden = false;
  }
});

// ─── Envelope ─────────────────────────────────────────────
const envelope = document.getElementById('envelope');
const hint = document.getElementById('letter-hint');
function toggleLetter() {
  const open = envelope.classList.toggle('open');
  hint.textContent = open ? 'TAP THE SEAL TO TUCK IT BACK' : 'TAP THE SEAL TO OPEN YOUR LETTER ♡';
}
document.getElementById('seal').addEventListener('click', toggleLetter);
hint.addEventListener('click', toggleLetter);

// ─── Countdown ────────────────────────────────────────────
const pad = n => String(n).padStart(2, '0');
const cd = id => document.getElementById(id);
function tick() {
  const diff = Math.max(0, PARTY_START - Date.now());
  cd('cd-d').textContent = pad(Math.floor(diff / 864e5));
  cd('cd-h').textContent = pad(Math.floor(diff / 36e5) % 24);
  cd('cd-m').textContent = pad(Math.floor(diff / 6e4) % 60);
  cd('cd-s').textContent = pad(Math.floor(diff / 1e3) % 60);
}
tick();
setInterval(tick, 1000);

// ─── Confetti ─────────────────────────────────────────────
if (CONFETTI) {
  const colors = ['var(--p)', 'var(--env)', 'var(--pink-soft)', 'var(--gold)', 'var(--t1)'];
  const box = document.getElementById('confetti');
  const r = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    const w = r(5, 9), round = Math.random() < 0.35;
    Object.assign(s.style, {
      left: r(0, 100) + '%', width: w + 'px', height: (round ? w : r(5, 14)) + 'px',
      borderRadius: round ? '50%' : '2px',
      background: colors[Math.floor(Math.random() * colors.length)],
      animationDuration: r(7, 13) + 's', animationDelay: -r(0, 13) + 's',
    });
    box.appendChild(s);
  }
}
