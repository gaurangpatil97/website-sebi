// Countdown target: 31 Oct 2026, 3:00 PM Pacific (= 31 Oct 22:00 UTC)
const PARTY_START = Date.UTC(2026, 9, 31, 22, 0);

// Paste your Google Apps Script web-app URL here (see wishes-sheet.gs)
const WISHES_URL = 'https://script.google.com/macros/s/AKfycbyXijmPb3zYLHtFtZfU39hI2mIZuMAb1-zqYuVGhZ-dgFSIfh_PU10Q9erhlpiouJoFpw/exec';

// ─── Guest data & Routing ─────────────────────────────────
let guestName = 'friend';
let guestCode = '';

function getSlug() {
  const path = decodeURIComponent(location.pathname).split('/').filter(Boolean).pop() || '';
  if (path && path.toLowerCase() !== 'index.html') return path.toLowerCase();
  const params = new URLSearchParams(location.search);
  const q = params.get('guest') || params.get('to') || params.get('name') || params.get('code');
  if (q) return q.toLowerCase();
  const hash = location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (hash && hash !== 'rsvp' && hash !== 'wish') return hash;
  return '';
}

function setGuest(name, code) {
  guestName = name || 'friend';
  guestCode = code || '';
  const guestEl = document.getElementById('guest-name');
  if (guestEl) guestEl.textContent = guestName;
  const wishEl = document.getElementById('wish-name');
  if (wishEl) wishEl.textContent = guestName;
  const thanksEl = document.getElementById('wish-thanks-name');
  if (thanksEl) thanksEl.textContent = guestName;
}

const slug = getSlug();

// Load guests from guests.json
fetch('guests.json')
  .then(res => res.json())
  .then(guests => {
    const match = guests.find(g =>
      g.route.toLowerCase() === slug ||
      g.code.toLowerCase() === slug ||
      g.name.toLowerCase() === slug
    );
    if (match) {
      setGuest(match.name, match.code);
    }
  })
  .catch(err => console.warn('Could not load guests.json', err));

// ─── Leave a wish ─────────────────────────────────────────
const wishForm = document.getElementById('wish-form');
const wishText = document.getElementById('wish-text');
const wishBtn = document.getElementById('wish-btn');
wishText.addEventListener('input', () => { wishBtn.disabled = !wishText.value.trim(); });
wishForm.addEventListener('submit', async e => {
  e.preventDefault();
  const wish = wishText.value.trim();
  if (!wish) return;
  wishBtn.disabled = true; wishBtn.textContent = 'SENDING…';
  document.getElementById('wish-error').hidden = true;
  try {
    if (WISHES_URL) {
      await fetch(WISHES_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ name: guestName, code: guestCode, wish })
      });
    }
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

// ─── Intro splash ─────────────────────────────────────────
const intro = document.getElementById('intro');
const hideIntro = () => { intro.classList.add('fade'); setTimeout(() => intro.remove(), 600); };
const introTimer = setTimeout(hideIntro, 2800);
intro.addEventListener('click', () => { clearTimeout(introTimer); hideIntro(); });
