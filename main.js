// ---------- Config ----------
// Node/Express + MongoDB API (product catalog)
const API_BASE = window.location.origin.includes('5000') || window.location.port === '5000'
  ? '/api'
  : 'http://localhost:5000/api';

// PHP + MySQL endpoints (newsletter / contact)
const PHP_BASE = 'php-sql';

// ---------- Mobile nav toggle ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Highlight active nav link
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });

  initNewsletterForm();
  initContactForm();
  loadDynamicProducts();
});

// ---------- Newsletter (PHP + MySQL) ----------
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    const msgEl = document.getElementById('newsletter-msg');

    try {
      const res = await fetch(`${PHP_BASE}/newsletter.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      msgEl.textContent = data.message;
      msgEl.className = 'form-msg ' + (data.success ? 'success' : 'error');
      if (data.success) form.reset();
    } catch (err) {
      msgEl.textContent = 'Could not reach the server. Please try again later.';
      msgEl.className = 'form-msg error';
    }
  });
}

// ---------- Contact form (PHP + MySQL) ----------
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const msgEl = document.getElementById('contact-msg');

    try {
      const res = await fetch(`${PHP_BASE}/contact.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      msgEl.textContent = data.message;
      msgEl.className = 'form-msg ' + (data.success ? 'success' : 'error');
      if (data.success) form.reset();
    } catch (err) {
      msgEl.textContent = 'Could not reach the server. Please try again later.';
      msgEl.className = 'form-msg error';
    }
  });
}

// ---------- Optional: pull live catalog from Node/Express + MongoDB API ----------
// Category pages already render static product cards from real site data,
// so this only runs if a container with [data-api-category] is present -
// e.g. to show a "Trending Now" section fed live from MongoDB.
async function loadDynamicProducts() {
  const container = document.querySelector('[data-api-category]');
  if (!container) return;

  const category = container.getAttribute('data-api-category');
  try {
    const res = await fetch(`${API_BASE}/products?category=${category}`);
    const data = await res.json();
    if (!data.success || !data.data.length) return;

    container.innerHTML = data.data
      .slice(0, 4)
      .map(
        (p) => `
        <div class="product-card">
          <div class="img-wrap"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <a class="btn" href="${p.buyLink}" target="_blank" rel="noopener">Buy Now</a>
          </div>
        </div>`
      )
      .join('');
  } catch (err) {
    // API not running - static content already covers the page, so fail silently
    console.warn('Live catalog API unavailable, showing static content only.');
  }
}
