(function () {
    'use strict';

    /* ── Config ─────────────────────────────────────────────────────────────── */
    const RSS_URL = 'https://arxiv-proxy.liyunyang95.workers.dev/';
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
    const KEYWORDS = ['gravitational wave', 'fast radio burst', 'cosmic microwave background', 'CMB', 'delensing', 'CMB lensing', 'Hubble Constant', 'Hubble Tension', 'cosmology', 'B-mode', 'E-mode', 'polarization', 'inflation', 'weak lensing', "Sunyaev-Zel'dovich", 'Sunyaev-Zeldovich', "Sunyaev Zel'dovich", 'concordance', 'baryon acoustic oscillations', '21 cm', '21-cm', 'dark energy', 'dark matter', 'anomalous microwave emission', 'Planck', 'map-making', 'line-intensity mapping',];
    const KEYWORDS_CASE = ['CLASS', 'WMAP', 'ACT', 'SPT', 'BICEP', 'CMB', 'SZ', 'Simons Observatory', 'S4', 'CMB-S4', 'SO', 'LIM',];

    /* ── State ──────────────────────────────────────────────────────────────── */
    const activeFilters = new Set();
    const totalKindCounts = {};

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
            btn.className = 'at-topic-btn';
            btn.id = 'at-toggle-' + k;
            btn.dataset.kind = k;

            const dot = document.createElement('span');
            dot.className = 'at-topic-dot';
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

    /* ── Fetch & render ─────────────────────────────────────────────────────── */
    function fetchAndRender() {
        const loadEl = document.getElementById('at-loading');
        if (loadEl) loadEl.style.display = 'block';

        fetch(RSS_URL, { cache: 'no-store' })
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(function (text) {
                const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
                if (xmlDoc.getElementsByTagName('parsererror').length) throw new Error('Invalid RSS XML');
                if (loadEl) loadEl.style.display = 'none';
                renderAll(xmlDoc);
            })
            .catch(function (err) {
                if (loadEl) loadEl.style.display = 'none';
                showError('Could not fetch arXiv RSS: ' + err.message);
            });
    }

    /* ── Render all sections ────────────────────────────────────────────────── */
    function renderAll(xmlDoc) {
        const channel = xmlDoc.getElementsByTagName('channel')[0];
        if (channel) {
            const pubDateStr = getText(channel, 'pubDate');
            if (pubDateStr) {
                const d = new Date(pubDateStr);
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                // Use UTC getters: pubDate is midnight Eastern (-04/05), which is still
                // the same calendar date in UTC. Local getters shift it to the previous day
                // for viewers west of Eastern time.
                const str = days[d.getUTCDay()] + ', ' + d.toLocaleDateString('en-US', {
                    timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric'
                });
                const badge = document.getElementById('at-date-badge');
                if (badge) {
                    badge.innerHTML = '';
                    const a = document.createElement('a');
                    a.href = 'https://rss.arxiv.org/rss/astro-ph';
                    a.target = '_blank';
                    a.className = 'link-muted';
                    a.textContent = str;
                    badge.appendChild(a);
                }
                const isToday = d.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);
                const color = isToday ? '#27ae60' : '#c0392b';
                ['at-new-badge', 'at-crs-badge', 'at-rep-badge'].forEach(function (id) {
                    const el = document.getElementById(id);
                    if (el) { el.textContent = str; el.style.color = color; }
                });
            }
        }

        const grouped = parseItems(xmlDoc);
        renderItems('at-new-list', grouped['new'],     'new');
        renderItems('at-crs-list', grouped['cross'],   'crs');
        renderItems('at-rep-list', grouped['replace'], 'rep');
    }

    /* ── Parse RSS items into { new, cross, replace } ───────────────────────── */
    function parseItems(xmlDoc) {
        const items = xmlDoc.getElementsByTagName('item');
        const result = { new: [], cross: [], replace: [] };

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            const title   = getText(item, 'title');
            const link    = getText(item, 'link');
            const arxivId = link.split('/abs/').pop() || '';

            // Strip "arXiv:ID Announce Type: TYPE\nAbstract: " preamble
            const rawDesc = getText(item, 'description');
            const abstract = rawDesc
                .replace(/^arXiv:\S+\s+Announce Type:\s*\S+[\s\S]*?Abstract:\s*/i, '')
                .trim();

            // Categories from one or more <category>astro-ph.CO</category>
            const catEls = item.getElementsByTagName('category');
            const cats = [];
            for (let j = 0; j < catEls.length; j++) {
                const sub = catEls[j].textContent.trim().split('.').pop();
                cats.push(KINDS.includes(sub) ? sub : 'other');
            }
            if (!cats.length) cats.push('other');

            // Authors from <dc:creator>Name1, Name2</dc:creator>
            const creatorsText = getText(item, 'dc:creator');
            const authors = creatorsText
                ? creatorsText.split(',').map(function (name) {
                    const n = name.trim();
                    return { name: n, href: 'https://arxiv.org/search/?query=' + encodeURIComponent(n) + '&searchtype=author' };
                })
                : [];

            const announceType = getText(item, 'arxiv:announce_type').trim();
            // arXiv types: new | cross | replace | replace-cross
            const bucket = announceType === 'new'                    ? 'new'
                         : announceType === 'cross'                  ? 'cross'
                         : announceType.startsWith('replace')        ? 'replace'
                         : 'new';
            result[bucket].push({ arxivId, title, cats, authors, abstract });
        }
        return result;
    }

    /* ── Render one list ────────────────────────────────────────────────────── */
    function renderItems(containerId, items, section) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        const total = items.length;

        items.forEach(function (paper, i) {
            const { arxivId, title, cats, authors, abstract } = paper;

            cats.forEach(function (c) {
                if (KINDS.includes(c)) {
                    totalKindCounts[c] = (totalKindCounts[c] || 0) + 1;
                    const countEl = document.getElementById('at-count-' + c);
                    if (countEl) countEl.textContent = totalKindCounts[c];
                }
            });

            const item = document.createElement('div');
            item.className = 'at-item';
            item.id = section + '-' + arxivId;
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
            titleTitle.textContent = title;
            titleTitle.addEventListener('click', function () { item.classList.toggle('collapsed'); });

            /* tags */
            const tagsRow = document.createElement('div');
            tagsRow.className = 'at-title-tags';

            const pdfTag = document.createElement('a');
            pdfTag.href = 'https://arxiv.org/pdf/' + arxivId;
            pdfTag.target = '_blank';
            pdfTag.title = 'PDF';
            const pdfCode = document.createElement('code');
            pdfCode.textContent = arxivId;
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
            authors.forEach(function (author, j) {
                if (j > 0) {
                    const sep = document.createElement('span');
                    sep.textContent = '; ';
                    sep.style.color = 'var(--color-text-muted)';
                    authorsEl.appendChild(sep);
                }
                const a = document.createElement('a');
                a.href = author.href;
                a.target = '_blank';
                a.textContent = author.name;
                authorsEl.appendChild(a);
            });

            /* abstract */
            const abstractEl = document.createElement('div');
            abstractEl.className = 'at-abstract';
            abstractEl.textContent = abstract;

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

            /* assemble */
            const titleWrap = document.createElement('div');
            titleWrap.className = 'at-title';
            titleWrap.appendChild(titleTitle);
            titleWrap.appendChild(tagsRow);

            const header = document.createElement('div');
            header.className = 'at-header';
            header.appendChild(titleWrap);

            const body = document.createElement('div');
            body.className = 'at-body';
            body.appendChild(header);
            body.appendChild(authorsEl);
            body.appendChild(abstractEl);

            item.appendChild(numEl);
            item.appendChild(body);
            container.appendChild(item);
        });
    }

    /* ── Helpers ─────────────────────────────────────────────────────────────── */
    function getText(el, tagName) {
        const found = el.getElementsByTagName(tagName)[0];
        return found ? found.textContent : '';
    }

    /* ── Topic filter ────────────────────────────────────────────────────────── */
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
            if (activeFilters.size === 0) { item.style.display = ''; return; }
            const visible = [...activeFilters].some(function (k) {
                return item.classList.contains('at-kind-' + k);
            });
            item.style.display = visible ? '' : 'none';
        });
    }

    /* ── Error ───────────────────────────────────────────────────────────────── */
    function showError(msg) {
        ['at-new-list', 'at-crs-list', 'at-rep-list'].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '<div class="at-error">' + msg + '</div>';
        });
    }

})();