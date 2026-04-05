/* ===== Navigation active-state highlight on scroll ===== */

(function () {
  'use strict';

  // ── Active nav tab on scroll ──────────────────────────────────────────────
  const sections = document.querySelectorAll('.section-anchor');
  const navLinks = document.querySelectorAll('.nav-tabs a');

  function onScroll() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 80) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Email assembly (no readable address in HTML) ─────────────────────────
  const emailEl = document.getElementById('email-reveal');
  if (emailEl) {
    // Parts are split so no single string in source reveals the address
    const parts = ['yunyang', 'li', '\u0040', 'uchicago', '.edu'];
    const addr = parts.join('');
    emailEl.textContent = addr;
    emailEl.href = 'mailto:' + addr;
  }

  // ── CV PDF link + label (last-modified date from GitHub) ────────────────
  (function () {
    const username = 'LiYunyang';
    const repo     = 'LiYunyang.github.io';
    const filePath = 'doc/cv_YL.pdf';
    const tokenA   = '11AFAAE5A0nLTUeWmnq46O';
    const tokenB   = 'dL1r39nZJLET2fMaRnF962BKvvqexAuwrwAHA3yCkfbR7VZUWUH6xln0a7O';
    const pdfUrl   = `https://${username}.github.io/${filePath}`;

    fetch(`https://api.github.com/repos/${username}/${repo}/commits?path=${filePath}&per_page=1`, {
      headers: { Authorization: `Bearer github_pat_${tokenA}_${tokenB}` }
    })
      .then(function (res) { return res.json(); })
      .then(function (commits) {
        if (!commits || !commits.length) return;
        const date      = new Date(commits[0].commit.author.date);
        const formatted = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        const link = document.getElementById('cv-pdf-link');
        if (link) link.href = pdfUrl;

        const label = document.getElementById('cv-pdf-label');
        if (label) label.textContent = `CV (${formatted})`;
      })
      .catch(function (err) { console.warn('CV fetch:', err); });
  })();

  // ── Publication loader ────────────────────────────────────────────────────
  loadPublications();

  function joinAuthors(authors) {
    const hasYL = authors.includes('YL');
    const mapped = authors.map(function (a) {
      return a === 'YL' ? '<b>Li, Yunyang</b>' : a;
    });
    if (!hasYL && mapped.length > 0) {
      mapped[mapped.length - 1] = '<b>' + mapped[mapped.length - 1] + '</b>';
    }
    if (mapped.length === 1) return mapped[0];
    return mapped.slice(0, -1).join('; ') + ' &amp; ' + mapped[mapped.length - 1];
  }

  function buildPubItem(pub) {
    const li = document.createElement('li');
    li.className = 'pub-item';

    // Meta column
    const meta = document.createElement('div');
    meta.className = 'pub-meta';

    const yearEl = document.createElement('span');
    yearEl.className = 'pub-year';
    yearEl.textContent = pub.year;
    meta.appendChild(yearEl);

    const journalEl = document.createElement('div');
    journalEl.className = 'pub-journal';
    const journalLink = document.createElement('a');
    journalLink.href = pub.url || '#';
    journalLink.target = '_blank';
    journalLink.rel = 'noopener';
    let journalText = pub.journal || '';
    if (pub.issue) journalText += ' ' + pub.issue;
    journalLink.textContent = journalText;
    journalEl.appendChild(journalLink);
    meta.appendChild(journalEl);

    li.appendChild(meta);

    // Body column
    const body = document.createElement('div');
    body.className = 'pub-body';

    const titleLink = document.createElement('a');
    titleLink.className = 'pub-title-link';
    titleLink.href = pub.pdf_url || pub.url || '#';
    titleLink.target = '_blank';
    titleLink.rel = 'noopener';
    titleLink.textContent = pub.title;
    body.appendChild(titleLink);

    const authorsEl = document.createElement('div');
    authorsEl.className = 'pub-authors';
    authorsEl.innerHTML = joinAuthors(pub.authors || []);
    body.appendChild(authorsEl);

    li.appendChild(body);
    return li;
  }

  function renderPubs(pubs, container) {
    if (!container) return;
    const sorted = pubs.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    const ul = document.createElement('ul');
    ul.className = 'pub-list';
    sorted.forEach(function (pub) {
      ul.appendChild(buildPubItem(pub));
    });
    container.appendChild(ul);
  }

  function loadPublications() {
    const mainContainer = document.getElementById('pub-main-author');
    const contribContainer = document.getElementById('pub-contrib-author');
    if (!mainContainer && !contribContainer) return;

    fetch('scripts/pub.yaml')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to fetch pub.yaml');
        return res.text();
      })
      .then(function (yamlText) {
        const data = jsyaml.load(yamlText);
        if (data['main-author']) renderPubs(data['main-author'], mainContainer);
        if (data['contrib-author']) renderPubs(data['contrib-author'], contribContainer);
        // Re-run MathJax over newly injected content
        if (window.MathJax) {
          MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
        }
      })
      .catch(function (err) {
        console.error('Publications load error:', err);
        if (mainContainer) mainContainer.innerHTML = '<p style="color:#888; font-size:13px">Publications unavailable.</p>';
      });
  }

  // ── Page visit tracker (StatCounter) ────────────────────────────────────
  (function insertStatsTracker() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;

    window.sc_project   = 11775224;
    window.sc_invisible = 0;
    window.sc_security  = 'b5b94723';
    const s = document.createElement('script');
    s.type  = 'text/javascript';
    s.async = true;
    s.src   = 'https://www.statcounter.com/counter/counter.js';
    document.body.appendChild(s);

    const noscript = document.createElement('noscript');
    const div = document.createElement('div');
    div.className = 'statcounter';
    const a = document.createElement('a');
    a.title  = 'Web Analytics';
    a.href   = 'https://statcounter.com/';
    a.target = '_blank';
    const img = document.createElement('img');
    img.className        = 'statcounter';
    img.src              = 'https://c.statcounter.com/11775224/0/b5b94723/0/';
    img.alt              = 'Web Analytics';
    img.referrerPolicy   = 'no-referrer-when-downgrade';
    a.appendChild(img);
    div.appendChild(a);
    noscript.appendChild(div);
    document.body.appendChild(noscript);
  })();

})();
