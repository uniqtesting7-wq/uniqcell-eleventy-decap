/* ============================================================
   UNIQ CELL — Main JS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger ──
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobNav');
  ham?.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob?.classList.toggle('open');
  });
  mob?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham?.classList.remove('open');
    mob.classList.remove('open');
  }));

  // ── Ticker (home page) ──
  const tTrack = document.getElementById('tickerTrack');
  if (tTrack) {
    const tItems = ['Laptop Terbaru','CCTV Berkualitas','Perangkat Jaringan','Garansi Resmi','Konsultasi Gratis','Harga Kompetitif','Instalasi Profesional'];
    tTrack.innerHTML = [...tItems, ...tItems]
      .map(t => `<span class="ticker-item">${t}<span style="opacity:.4;margin-left:8px">◆</span></span>`)
      .join('');
  }

  // ── Product catalog filter (products page) ──
  initCatalogPage();

  // ── Product detail (detail page) ──
  initDetailPage();

  // ── Intersection observer fade-in ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.observe-fade').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});

/* ── CATALOG PAGE ── */
function initCatalogPage() {
  const grid = document.getElementById('prodCatalogGrid');
  if (!grid) return;

  // Products are embedded as JSON from the template
  const productsData = window.CATALOG_PRODUCTS || [];
  let activeCategory = 'all';
  let activePrice    = 'all';
  let activeSort     = 'default';
  let searchQuery    = '';
  let viewMode       = 'grid';

  // Read URL params
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('cat')) activeCategory = urlParams.get('cat');

  function getFiltered() {
    let list = [...productsData];
    if (activeCategory !== 'all') list = list.filter(p => p.kategori === activeCategory);
    if (activePrice !== 'all') {
      const [mn, mx] = activePrice.split('-').map(Number);
      list = list.filter(p => p.price >= mn && p.price <= mx);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.spec.toLowerCase().includes(q));
    }
    if (activeSort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (activeSort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (activeSort === 'name-asc')   list.sort((a, b) => a.name.localeCompare(b.name));
    if (activeSort === 'name-desc')  list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }

  const catLabel = { laptop:'Laptop', cctv:'CCTV', jaringan:'Jaringan' };
  const catIcon  = { laptop:'bi-laptop', cctv:'bi-camera-video', jaringan:'bi-router' };
  const WA = window.SITE_CONFIG?.waNumber || '6285755913524';
  const fmt = n => 'Rp ' + Number(n).toLocaleString('id-ID');

  function render() {
    const list = getFiltered();
    grid.innerHTML = '';

    const resultInfo = document.getElementById('resultInfo');
    if (resultInfo) resultInfo.innerHTML = `Menampilkan <strong>${list.length}</strong> dari ${productsData.length} produk`;

    // Category counts
    const base = productsData.filter(p => {
      if (activePrice !== 'all') { const [mn,mx] = activePrice.split('-').map(Number); if (p.price < mn || p.price > mx) return false; }
      if (searchQuery) { const q = searchQuery.toLowerCase(); return p.name.toLowerCase().includes(q) || p.spec.toLowerCase().includes(q); }
      return true;
    });
    const setCount = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setCount('countAll', base.length);
    setCount('countLaptop', base.filter(p=>p.kategori==='laptop').length);
    setCount('countCctv', base.filter(p=>p.kategori==='cctv').length);
    setCount('countJaringan', base.filter(p=>p.kategori==='jaringan').length);

    renderChips();

    const hasFilter = activeCategory!=='all' || activePrice!=='all' || searchQuery || activeSort!=='default';
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.style.display = hasFilter ? '' : 'none';

    if (!list.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-search"></i>
          <h3>Produk tidak ditemukan</h3>
          <p>Coba ubah kata kunci atau hapus filter yang aktif.</p>
          <button class="btn-reset" onclick="resetAllFilters()"><i class="bi bi-x-circle"></i> Reset Filter</button>
        </div>`;
      return;
    }

    list.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'prod-card';
      el.style.animationDelay = (i * 0.045) + 's';
      const waMsg = encodeURIComponent(`Halo, saya ingin info:\n*${p.name}*\nHarga: ${fmt(p.price)}`);

      if (viewMode === 'list') {
        el.innerHTML = `
          <div class="prod-img" style="width:170px;flex-shrink:0;cursor:pointer" onclick="window.location='/products/${p.slug}/'">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <div class="prod-cat-badge ${p.kategori}"><i class="bi ${catIcon[p.kategori]}"></i> ${catLabel[p.kategori]}</div>
          </div>
          <div class="prod-body" style="flex-direction:row;align-items:center;gap:16px;padding:14px 18px">
            <div class="prod-info-col" style="flex:1">
              <div class="prod-name" style="cursor:pointer" onclick="window.location='/products/${p.slug}/'">${p.name}</div>
              <div class="prod-spec">${p.spec}</div>
            </div>
            <div class="prod-action-col" style="flex-shrink:0;display:flex;flex-direction:column;gap:7px;align-items:flex-end;min-width:140px">
              <div class="prod-price">${fmt(p.price)}</div>
              <a class="btn-detail-link" href="/products/${p.slug}/"><i class="bi bi-eye"></i> Lihat Detail</a>
              <div style="display:flex;gap:6px">
                <button class="btn-addcart" data-id="${p.slug}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}"><i class="bi bi-bag-plus"></i></button>
                <a class="btn-wa-card" href="https://wa.me/${WA}?text=${waMsg}" target="_blank"><i class="bi bi-whatsapp"></i> WA</a>
              </div>
            </div>
          </div>`;
      } else {
        el.innerHTML = `
          <div class="prod-img" style="cursor:pointer" onclick="window.location='/products/${p.slug}/'">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <div class="prod-cat-badge ${p.kategori}"><i class="bi ${catIcon[p.kategori]}"></i> ${catLabel[p.kategori]}</div>
          </div>
          <div class="prod-body">
            <div class="prod-name" style="cursor:pointer" onclick="window.location='/products/${p.slug}/'">${p.name}</div>
            <div class="prod-spec">${p.spec}</div>
            <div class="prod-price">${fmt(p.price)}</div>
            <a class="btn-detail-link" href="/products/${p.slug}/"><i class="bi bi-eye"></i> Lihat Detail</a>
            <div class="prod-actions">
              <button class="btn-addcart" data-id="${p.slug}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}"><i class="bi bi-bag-plus"></i> Keranjang</button>
              <a class="btn-wa-card" href="https://wa.me/${WA}?text=${waMsg}" target="_blank"><i class="bi bi-whatsapp"></i> WA</a>
            </div>
          </div>`;
      }

      grid.appendChild(el);
    });

    // Bind add-to-cart
    grid.querySelectorAll('.btn-addcart').forEach(b => {
      b.addEventListener('click', () => addToCart(b.dataset.id, b.dataset.name, Number(b.dataset.price), b.dataset.img));
    });
  }

  function renderChips() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    container.innerHTML = '';
    if (activeCategory !== 'all') addChip(container, catLabel[activeCategory], () => { activeCategory='all'; updateCatUI(); render(); });
    if (activePrice !== 'all') {
      const labels = {'0-1000000':'< Rp 1 jt','1000000-5000000':'Rp 1–5 jt','5000000-20000000':'Rp 5–20 jt','20000000-999999999':'> Rp 20 jt'};
      addChip(container, labels[activePrice] || activePrice, () => { activePrice='all'; document.querySelector('input[name="price"][value="all"]').checked=true; render(); });
    }
    if (searchQuery) addChip(container, `"${searchQuery}"`, () => { searchQuery=''; document.getElementById('searchInput').value=''; document.getElementById('searchClear')?.classList.remove('show'); render(); });
    if (activeSort !== 'default') {
      const sl = {'price-asc':'Harga ↑','price-desc':'Harga ↓','name-asc':'A–Z','name-desc':'Z–A'};
      addChip(container, sl[activeSort], () => { activeSort='default'; document.getElementById('sortSelect').value='default'; render(); });
    }
  }

  function addChip(container, label, onRemove) {
    const chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.innerHTML = `${label} <button><i class="bi bi-x"></i></button>`;
    chip.querySelector('button').addEventListener('click', onRemove);
    container.appendChild(chip);
  }

  window.resetAllFilters = function() {
    activeCategory='all'; activePrice='all'; activeSort='default'; searchQuery='';
    const si = document.getElementById('searchInput'); if (si) si.value='';
    document.getElementById('searchClear')?.classList.remove('show');
    const ss = document.getElementById('sortSelect'); if (ss) ss.value='default';
    const allPriceRadio = document.querySelector('input[name="price"][value="all"]');
    if (allPriceRadio) allPriceRadio.checked = true;
    updateCatUI();
    render();
  };

  function updateCatUI() {
    document.querySelectorAll('.cat-item').forEach(el => {
      el.classList.toggle('active', el.dataset.cat === activeCategory);
    });
  }

  // Events
  document.querySelectorAll('.cat-item').forEach(el => {
    el.addEventListener('click', () => { activeCategory = el.dataset.cat; updateCatUI(); render(); });
  });
  document.querySelectorAll('input[name="price"]').forEach(el => {
    el.addEventListener('change', () => { activePrice = el.value; render(); });
  });
  const sortSel = document.getElementById('sortSelect');
  sortSel?.addEventListener('change', e => { activeSort = e.target.value; render(); });
  const searchInput = document.getElementById('searchInput');
  searchInput?.addEventListener('input', e => {
    searchQuery = e.target.value.trim();
    document.getElementById('searchClear')?.classList.toggle('show', searchQuery.length > 0);
    render();
  });
  document.getElementById('searchClear')?.addEventListener('click', () => {
    searchQuery=''; searchInput.value='';
    document.getElementById('searchClear').classList.remove('show');
    render();
  });
  document.getElementById('viewGrid')?.addEventListener('click', () => {
    viewMode='grid'; grid.classList.remove('list-view');
    document.getElementById('viewGrid')?.classList.add('active');
    document.getElementById('viewList')?.classList.remove('active');
    render();
  });
  document.getElementById('viewList')?.addEventListener('click', () => {
    viewMode='list'; grid.classList.add('list-view');
    document.getElementById('viewList')?.classList.add('active');
    document.getElementById('viewGrid')?.classList.remove('active');
    render();
  });
  document.getElementById('mobFilterToggle')?.addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    const ic = document.getElementById('mobFilterIcon');
    sb?.classList.toggle('mob-open');
    if (ic) ic.className = sb?.classList.contains('mob-open') ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
  });
  document.getElementById('resetBtn')?.addEventListener('click', window.resetAllFilters);

  updateCatUI();
  render();
}

/* ── DETAIL PAGE ── */
function initDetailPage() {
  const detailRoot = document.getElementById('detailRoot');
  if (!detailRoot) return;

  let qty = 1;
  const qtyNum   = document.getElementById('qtyNum');
  const btnMinus = document.getElementById('qtyMinus');
  const btnPlus  = document.getElementById('qtyPlus');

  btnMinus?.addEventListener('click', () => { if (qty > 1) { qty--; if (qtyNum) qtyNum.textContent = qty; } });
  btnPlus?.addEventListener('click',  () => { qty++; if (qtyNum) qtyNum.textContent = qty; });

  const btnAdd = document.getElementById('btnAddCart');
  if (btnAdd) {
    const { id, name, price, img } = btnAdd.dataset;
    btnAdd.addEventListener('click', () => {
      for (let i = 0; i < qty; i++) addToCart(id, name, Number(price), img);
    });
  }

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('tab-' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

/* ── HOME PAGE ── */
function initHomeFilter() {
  const filterBar = document.getElementById('homeFilterBar');
  if (!filterBar) return;

  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.f-btn');
    if (!btn) return;
    document.querySelectorAll('#homeFilterBar .f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.home-prod-card').forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initHomeFilter);
