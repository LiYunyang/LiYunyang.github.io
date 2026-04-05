(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────────────────────── */
  const PROXY     = 'https://cors-anywhere-for-yl.herokuapp.com/';
  const ARXIV_URL = 'https://export.arxiv.org/list/astro-ph/new';

  const KINDS = ['CO', 'HE', 'GA', 'IM', 'SR', 'EP'];

  const KIND_COLORS = {
    GA: 'rgba(44, 126, 212, 1)',
    SR: 'rgba(255, 215, 0, 1)',
    HE: 'rgba(255, 69, 0, 1)',
    CO: 'rgba(34, 139, 34, 1)',
    IM: 'rgba(105, 105, 105, 1)',
    EP: 'rgba(139, 69, 19, 1)',
    other: 'rgba(20, 20, 20, 1)'
  };
  const KEYWORDS = [
    'gravitational wave', 'fast radio burst',
    'cosmic microwave background', 'CMB', 'delensing', 'CMB lensing' ,'Hubble Constant', 'Hubble Tension',
    'cosmology', 'B-mode', 'E-mode', 'polarization', 'inflation',
    'weak lensing', "Sunyaev-Zel'dovich", 'Sunyaev-Zeldovich',
    "Sunyaev Zel'dovich", 'concordance', 'baryon acoustic oscillations', 'BAO',
    'BAO', '21 cm', '21-cm', 'dark energy', 'dark matter',
    'anomalous microwave emission', 'Planck', 'map-making', 'line-intensity mapping', 'LIM',
  ];

  const KEYWORDS_CASE = [
    'CLASS', 'WMAP', 'ACT', 'SPT', 'BICEP', 'AME',
    'CMB', 'SZ', 'Simons Observatory', 'S4', 'CMB-S4', 'SO',
  ];

  /* ── State ──────────────────────────────────────────────────────────────── */
  const activeFilters = new Set();
  const totalKindCounts = {};   // accumulated across both sections

  /* ── Bootstrap ──────────────────────────────────────────────────────────── */
  window.addEventListener('load', function () {
    buildToggles();
    fetchAndRender();
  });

  /* ── Build sidebar toggle buttons ──────────────────────────────────────── */
  function buildToggles() {
    const box = document.getElementById('at-topic-toggles');
    if (!box) return;
    KINDS.forEach(function (k) {
      const btn = document.createElement('button');
      btn.className  = 'at-topic-btn';
      btn.id         = 'at-toggle-' + k;
      btn.dataset.kind = k;

      const dot = document.createElement('span');
      dot.className  = 'at-topic-dot';
      dot.style.background = KIND_COLORS[k];

      const label = document.createElement('span');
      label.textContent = 'astro-ph.' + k;

      const count = document.createElement('span');
      count.className = 'at-topic-count';
      count.id = 'at-count-' + k;

      btn.appendChild(dot);
      btn.appendChild(label);
      btn.appendChild(count);
      btn.addEventListener('click', function () { toggleKind(k); });
      box.appendChild(btn);
    });
  }

  /* ── Fetch arXiv via CORS proxy ─────────────────────────────────────────── */
  function fetchAndRender() {
    const loadEl = document.getElementById('at-loading');
    if (loadEl) loadEl.style.display = 'block';

    fetch(PROXY + ARXIV_URL + '?nocache=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        if (loadEl) loadEl.style.display = 'none';
        renderAll(doc);
      })
      .catch(function (err) {
        if (loadEl) loadEl.style.display = 'none';
        showError('Could not fetch arXiv listings: ' + err.message);
      });
  }

  /* ── Render both sections ────────────────────────────────────────────────── */
  function renderAll(doc) {
    const dls  = doc.getElementsByTagName('dl');
    const h3s  = doc.getElementsByTagName('h3');

    // Parse and show date
    if (h3s.length > 0) {
      const match = h3s[0].textContent.match(/for\s+(.+)/);
      if (match) {
        const d    = new Date(match[1]);
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const str  = days[d.getDay()] + ', ' + d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
        const badge = document.getElementById('at-date-badge');
        if (badge) badge.textContent = str;
        const isToday = d.getDate() >= new Date().getDate();
        const color   = isToday ? '#27ae60' : '#c0392b';
        ['at-new-badge','at-crs-badge'].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) { el.textContent = str; el.style.color = color; }
        });
      }
    }

    if (dls[0]) populateList('at-new-list', dls[0], 'new');
    if (dls[1]) populateList('at-crs-list', dls[1], 'crs');
  }

  /* ── Populate one paper list ─────────────────────────────────────────────── */
  function populateList(containerId, dl, section) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const dts = dl.getElementsByTagName('dt');
    const dds = dl.getElementsByTagName('dd');
    const total = dds.length;

    for (let i = 0; i < total; i++) {
      const id = dts[i].getElementsByTagName('a')[1].id;

      /* ── Determine categories ── */
      const subjEl = dds[i].getElementsByClassName('list-subjects')[0];
      const subjText = subjEl ? subjEl.textContent : '';
      const catMatches = subjText.match(/\(.*?\.\S*?\)/g) || [];
      const cats = catMatches.map(function (c) {
        const sub = c.slice(-3, -1);
        return KINDS.includes(sub) ? sub : (c.match(/\..*?\)/g) || ['other'])[0].slice(1, -1);
      });
      if (!cats.length) cats.push('other');

      /* count per kind — accumulate totals across both sections */
      cats.forEach(function (c) {
        if (KINDS.includes(c)) {
          totalKindCounts[c] = (totalKindCounts[c] || 0) + 1;
          const countEl = document.getElementById('at-count-' + c);
          if (countEl) countEl.textContent = totalKindCounts[c];
        }
      });

      /* ── Build item ── */
      const item = document.createElement('div');
      item.className = 'at-item';
      item.id = section + '-' + id;
      cats.forEach(function (c) { item.classList.add('at-kind-' + c); });

      /* number */
      const numEl = document.createElement('div');
      numEl.className = 'at-num';
      const numCode = document.createElement('code');
      numCode.textContent = (i + 1) + '/' + total;
      numEl.appendChild(numCode);

      /* title */
      const titleTitle = document.createElement('div');
      titleTitle.className = 'at-title-title';
      const rawTitle = dds[i].getElementsByClassName('list-title')[0];
      titleTitle.textContent = rawTitle ? rawTitle.textContent.replace(/^\s*Title:\s*/i, '').trim() : '';
      titleTitle.addEventListener('click', function () { item.classList.toggle('collapsed'); });

      /* tags */
      const tagsRow = document.createElement('div');
      tagsRow.className = 'at-title-tags';

      const pdfTag = document.createElement('a');
      pdfTag.href    = 'https://arxiv.org/pdf/' + id;
      pdfTag.target  = '_blank';
      pdfTag.title   = 'PDF';
      const pdfCode  = document.createElement('code');
      pdfCode.textContent = id;
      pdfTag.appendChild(pdfCode);
      pdfTag.classList.add('at-tag', 'at-arxiv-tag');
      tagsRow.appendChild(pdfTag);

      cats.forEach(function (c) {
        const tag = document.createElement('span');
        tag.classList.add('at-tag');
        tag.textContent = c;
        tag.style.background = KIND_COLORS[c] || KIND_COLORS.other;
        tagsRow.appendChild(tag);
      });

      /* authors */
      const authorsEl = document.createElement('div');
      authorsEl.className = 'at-authors';
      const authorLinks = dds[i].getElementsByClassName('list-authors')[0];
      if (authorLinks) {
        const as = authorLinks.getElementsByTagName('a');
        for (let j = 0; j < as.length; j++) {
          const a = document.createElement('a');
          a.href   = 'https://export.arxiv.org' + as[j].getAttribute('href');
          a.target = '_blank';
          a.textContent = as[j].textContent;
          if (j > 0) {
            const sep = document.createElement('span');
            sep.textContent = '; ';
            sep.style.color = 'var(--color-text-muted)';
            authorsEl.appendChild(sep);
          }
          authorsEl.appendChild(a);
        }
      }

      /* abstract */
      const abstractEl = document.createElement('div');
      abstractEl.className = 'at-abstract';
      const ps = dds[i].getElementsByTagName('p');
      abstractEl.textContent = ps.length ? ps[0].textContent.trim() : '';

      /* keyword highlighting */
      const marker = new Mark(abstractEl);
      marker.mark(KEYWORDS, {
        separateWordSearch: false,
        accuracy: 'exactly',
        ignorePunctuation: ':;.,-–—‒_(){}[]!\'"+='.split(''),
        done: function (n) { if (n > 0) titleTitle.classList.add('key_matched'); }
      });
      marker.mark(KEYWORDS_CASE, {
        separateWordSearch: false,
        accuracy: 'exactly',
        caseSensitive: true,
        ignorePunctuation: ':;.,-–—‒_(){}[]!\'"+='.split(''),
        done: function (n) { if (n > 0) titleTitle.classList.add('key_matched'); }
      });

      /* MathJax */
      if (window.MathJax) {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, titleTitle]);
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, abstractEl]);
      }

      /* header row */
      const header = document.createElement('div');
      header.className = 'at-header';

      const titleWrap = document.createElement('div');
      titleWrap.className = 'at-title';
      titleWrap.appendChild(titleTitle);
      titleWrap.appendChild(tagsRow);
      header.appendChild(titleWrap);

      /* right-column body */
      const body = document.createElement('div');
      body.className = 'at-body';
      body.appendChild(header);
      body.appendChild(authorsEl);
      body.appendChild(abstractEl);

      item.appendChild(numEl);
      item.appendChild(body);
      container.appendChild(item);
    }
  }

  /* ── Topic filter toggle ─────────────────────────────────────────────────── */
  function toggleKind(kind) {
    const btn = document.getElementById('at-toggle-' + kind);
    if (activeFilters.has(kind)) {
      activeFilters.delete(kind);
      btn.classList.remove('active');
      btn.style.background = '';
    } else {
      activeFilters.add(kind);
      btn.classList.add('active');
      btn.style.background = KIND_COLORS[kind];
    }
    applyFilters();
  }

  function applyFilters() {
    const items = document.querySelectorAll('.at-item');
    items.forEach(function (item) {
      if (activeFilters.size === 0) {
        item.style.display = '';
        return;
      }
      const visible = [...activeFilters].some(function (k) {
        return item.classList.contains('at-kind-' + k);
      });
      item.style.display = visible ? '' : 'none';
    });
  }

  /* ── Error helper ────────────────────────────────────────────────────────── */
  function showError(msg) {
    ['at-new-list', 'at-crs-list'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '<div class="at-error">' + msg + '</div>';
    });
  }

})();
