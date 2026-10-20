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
  try {
    if (guestName && guestName !== 'friend') {
      sessionStorage.setItem('guest_name', guestName);
      sessionStorage.setItem('guest_code', guestCode);
      localStorage.setItem('guest_name', guestName);
      localStorage.setItem('guest_code', guestCode);
    }
  } catch (e) {}
  const guestEl = document.getElementById('guest-name');
  if (guestEl) guestEl.textContent = guestName;
  const wishEl = document.getElementById('wish-name');
  if (wishEl) wishEl.textContent = guestName;
  const thanksEl = document.getElementById('wish-thanks-name');
  if (thanksEl) thanksEl.textContent = guestName;
}

// One-way hash verification (keeps invite links completely private from Network tab & sources)
function hashRoute(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) + s.charCodeAt(i);
    h |= 0;
  }
  return (h >>> 0).toString(36);
}

const VALID_INVITES = new Set([
  '1iqleyd','srav5w','1ylp02e','1fuz7sb','2e6qq7','1jbi8i8','75j964','13uilk0',
  '1ksm65q','1ot250x','cfian0','1d6p3ob','13tjpey','qhftuy','etbim3','hr012t',
  '1s700zo','p2ib5p','epv3jg','au4buf','ir4ttu','1bbh2oh','17uimg7','1767ytz',
  '1gmn7vr','1g5kj79','1skqflp','ab99fd','1muvnzx','t82aln','11lleta','g3zbh',
  '25bl2p','14xy21m','6gnazo','1dlcqbw','9st2wo','18lqwlc','1njin0u'
]);

const slug = getSlug();
if (slug === 'gp-tp-links-guests') {
  window.location.replace('/gp-tp-links-guests.html');
} else if (slug && VALID_INVITES.has(hashRoute(slug))) {
  const parts = slug.split('-');
  const code = parts[0];
  const name = parts.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  setGuest(name, code);
} else {
  // If slug is lost (e.g. from clicking #rsvp with base href or page refresh), restore from storage
  try {
    const savedName = sessionStorage.getItem('guest_name') || localStorage.getItem('guest_name');
    const savedCode = sessionStorage.getItem('guest_code') || localStorage.getItem('guest_code');
    if (savedName && savedName !== 'friend') {
      setGuest(savedName, savedCode || '');
    }
  } catch (e) {}
}

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
const hideIntro = () => { intro.classList.add('fade'); setTimeout(() => intro.remove(), 400); };
const introTimer = setTimeout(hideIntro, 1400);
intro.addEventListener('click', () => { clearTimeout(introTimer); hideIntro(); });
