/* ============================================================
   UNIQ CELL — Main JS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger ──
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobNav');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mob.classList.toggle('open');
    });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open');
      mob.classList.remove('open');
    }));
  }

  // ── Ticker ──
  const tTrack = document.getElementById('tickerTrack');
  if (tTrack) {
    const items = ['Laptop Terbaru','CCTV Berkualitas','Perangkat Jaringan','Garansi Resmi','Konsultasi Gratis','Harga Kompetitif','Instalasi Profesional'];
    tTrack.innerHTML = [...items,...items]
      .map(t => `<span class="ticker-item">${t}<span style="opacity:.4;margin-left:12px">◆</span></span>`)
      .join('');
  }

  // ── Home page filter ──
  const homeFilter = document.getElementById('homeFilterBar');
  if (homeFilter) {
    homeFilter.addEventListener('click', e => {
      const btn = e.target.closest('.f-btn');
      if (!btn) return;
      homeFilter.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.home-prod-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.cat === filter) ? '' : 'none';
      });
    });
  }

  // ── Home add-to-cart ──
  if (document.querySelector('.home-prod-card')) {
    document.querySelectorAll('.btn-addcart').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(b.dataset.id, b.dataset.name, Number(b.dataset.price), b.dataset.img);
      });
    });
  }

  // ── Catalog page ──
  initCatalogPage();

  // ── Detail page ──
  initDetailPage();
});

/* ─────────────────────────────────────────── */
/* CATALOG PAGE                               */
/* ─────────────────────────────────────────── */
function initCatalogPage() {
  const grid = document.getElementById('prodCatalogGrid');
  if (!grid || !window.CATALOG_PRODUCTS) return;

  const products = window.CATALOG_PRODUCTS;
  const WA = (window.SITE_CONFIG && window.SITE_CONFIG.waNumber) || '6285755913524';
  const fmt = n => 'Rp ' + Number(n).toLocaleString('id-ID');
  const catLabel = { laptop:'Laptop', cctv:'CCTV', jaringan:'Jaringan' };
  const catIcon  = { laptop:'bi-laptop', cctv:'bi-camera-video', jaringan:'bi-router' };

  let activeCat   = 'all';
  let activePrice = 'all';
  let activeSort  = 'default';
  let searchQ     = '';
  let viewMode    = 'grid';

  // Read URL param
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('cat')) { activeCat = urlParams.get('cat'); updateCatUI(); }

  function getFiltered() {
    let list = [...products];
    if (activeCat !== 'all') list = list.filter(p => p.kategori === activeCat);
    if (activePrice !== 'all') {
      const [mn, mx] = activePrice.split('-').map(Number);
      list = list.filter(p => p.price >= mn && p.price <= mx);
    }
    if (searchQ) {
      const q = searchQ.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.spec.toLowerCase().includes(q));
    }
    if (activeSort === 'price-asc')  list.sort((a,b) => a.price - b.price);
    if (activeSort === 'price-desc') list.sort((a,b) => b.price - a.price);
    if (activeSort === 'name-asc')   list.sort((a,b) => a.name.localeCompare(b.name));
    if (activeSort === 'name-desc')  list.sort((a,b) => b.name.localeCompare(a.name));
    return list;
  }

  function render() {
    const list = getFiltered();
    grid.innerHTML = '';

    // Update counts
    const base = products.filter(p => {
      if (activePrice !== 'all') { const [mn,mx]=activePrice.split('-').map(Number); if(p.price<mn||p.price>mx) return false; }
      if (searchQ) { const q=searchQ.toLowerCase(); return p.name.toLowerCase().includes(q)||p.spec.toLowerCase().includes(q); }
      return true;
    });
    const setEl = (id, v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
    setEl('resultInfo', `Menampilkan <b style="color:var(--navy)">${list.length}</b> dari ${products.length} produk`);
    document.getElementById('resultInfo').innerHTML = `Menampilkan <strong>${list.length}</strong> dari ${products.length} produk`;
    setEl('countAll',      base.length);
    setEl('countLaptop',   base.filter(p=>p.kategori==='laptop').length);
    setEl('countCctv',     base.filter(p=>p.kategori==='cctv').length);
    setEl('countJaringan', base.filter(p=>p.kategori==='jaringan').length);

    renderChips();
    const hasFilter = activeCat!=='all'||activePrice!=='all'||searchQ||activeSort!=='default';
    const rb = document.getElementById('resetBtn');
    if (rb) rb.style.display = hasFilter ? '' : 'none';

    if (!list.length) {
      grid.innerHTML = `<div class="empty-state"><i class="bi bi-search"></i><h3>Produk tidak ditemukan</h3><p>Coba ubah kata kunci atau hapus filter.</p><button class="btn-reset" onclick="resetAllFilters()"><i class="bi bi-x-circle"></i> Reset Filter</button></div>`;
      return;
    }

    list.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'prod-card';
      el.style.animationDelay = (i * 0.045) + 's';
      const waMsg = encodeURIComponent(`Halo, saya ingin info:\n*${p.name}*\nHarga: ${fmt(p.price)}`);
      const badge = `<div class="prod-cat-badge ${p.kategori}"><i class="bi ${catIcon[p.kategori]}"></i> ${catLabel[p.kategori]}</div>`;
      const detailUrl = `/products/${p.slug}/`;

      if (viewMode === 'list') {
        el.innerHTML = `
          <div class="prod-img" style="cursor:pointer;width:170px;flex-shrink:0" onclick="location.href='${detailUrl}'">
            <img src="${p.img}" alt="${p.name}" loading="lazy">${badge}
          </div>
          <div class="prod-body" style="flex-direction:row;align-items:center;gap:16px;padding:14px 18px">
            <div style="flex:1">
              <div class="prod-name" style="cursor:pointer" onclick="location.href='${detailUrl}'">${p.name}</div>
              <div class="prod-spec">${p.spec}</div>
            </div>
            <div style="flex-shrink:0;display:flex;flex-direction:column;gap:7px;align-items:flex-end;min-width:140px">
              <div class="prod-price">${fmt(p.price)}</div>
              <a class="btn-detail-link" href="${detailUrl}"><i class="bi bi-eye"></i> Lihat Detail</a>
              <div style="display:flex;gap:6px">
                <button class="btn-addcart" data-id="${p.slug}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}"><i class="bi bi-bag-plus"></i></button>
                <a class="btn-wa-card" href="https://wa.me/${WA}?text=${waMsg}" target="_blank"><i class="bi bi-whatsapp"></i> WA</a>
              </div>
            </div>
          </div>`;
      } else {
        el.innerHTML = `
          <div class="prod-img" style="cursor:pointer" onclick="location.href='${detailUrl}'">
            <img src="${p.img}" alt="${p.name}" loading="lazy">${badge}
          </div>
          <div class="prod-body">
            <div class="prod-name" style="cursor:pointer" onclick="location.href='${detailUrl}'">${p.name}</div>
            <div class="prod-spec">${p.spec}</div>
            <div class="prod-price">${fmt(p.price)}</div>
            <a class="btn-detail-link" href="${detailUrl}"><i class="bi bi-eye"></i> Lihat Detail</a>
            <div class="prod-actions">
              <button class="btn-addcart" data-id="${p.slug}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}"><i class="bi bi-bag-plus"></i> Keranjang</button>
              <a class="btn-wa-card" href="https://wa.me/${WA}?text=${waMsg}" target="_blank"><i class="bi bi-whatsapp"></i> WA</a>
            </div>
          </div>`;
      }
      grid.appendChild(el);
    });

    grid.querySelectorAll('.btn-addcart').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(b.dataset.id, b.dataset.name, Number(b.dataset.price), b.dataset.img);
      });
    });
  }

  function renderChips() {
    const c = document.getElementById('activeFilters'); if(!c) return; c.innerHTML='';
    if (activeCat !== 'all') addChip(c, catLabel[activeCat], ()=>{ activeCat='all'; updateCatUI(); render(); });
    if (activePrice !== 'all') {
      const lbs = {'0-1000000':'<Rp1jt','1000000-5000000':'Rp1-5jt','5000000-20000000':'Rp5-20jt','20000000-999999999':'>Rp20jt'};
      addChip(c, lbs[activePrice]||activePrice, ()=>{ activePrice='all'; document.querySelector('input[name="price"][value="all"]').checked=true; render(); });
    }
    if (searchQ) addChip(c, `"${searchQ}"`, ()=>{ searchQ=''; document.getElementById('searchInput').value=''; document.getElementById('searchClear').classList.remove('show'); render(); });
    if (activeSort!=='default') {
      const sl={'price-asc':'Harga↑','price-desc':'Harga↓','name-asc':'A-Z','name-desc':'Z-A'};
      addChip(c, sl[activeSort], ()=>{ activeSort='default'; document.getElementById('sortSelect').value='default'; render(); });
    }
  }

  function addChip(c, label, fn) {
    const chip = document.createElement('div'); chip.className='filter-chip';
    chip.innerHTML=`${label} <button><i class="bi bi-x"></i></button>`;
    chip.querySelector('button').addEventListener('click', fn); c.appendChild(chip);
  }

  function updateCatUI() {
    document.querySelectorAll('.cat-item').forEach(el => {
      el.classList.toggle('active', el.dataset.cat === activeCat);
    });
  }

  window.resetAllFilters = function() {
    activeCat='all'; activePrice='all'; activeSort='default'; searchQ='';
    const si=document.getElementById('searchInput'); if(si) si.value='';
    document.getElementById('searchClear')?.classList.remove('show');
    const ss=document.getElementById('sortSelect'); if(ss) ss.value='default';
    const pr=document.querySelector('input[name="price"][value="all"]'); if(pr) pr.checked=true;
    updateCatUI(); render();
  };

  document.querySelectorAll('.cat-item').forEach(el => {
    el.addEventListener('click', () => { activeCat=el.dataset.cat; updateCatUI(); render(); });
  });
  document.querySelectorAll('input[name="price"]').forEach(el => {
    el.addEventListener('change', () => { activePrice=el.value; render(); });
  });
  document.getElementById('sortSelect')?.addEventListener('change', e => { activeSort=e.target.value; render(); });
  const si = document.getElementById('searchInput');
  si?.addEventListener('input', e => {
    searchQ=e.target.value.trim();
    document.getElementById('searchClear')?.classList.toggle('show', searchQ.length>0);
    render();
  });
  document.getElementById('searchClear')?.addEventListener('click', () => {
    searchQ=''; si.value=''; document.getElementById('searchClear').classList.remove('show'); render();
  });
  document.getElementById('viewGrid')?.addEventListener('click', () => {
    viewMode='grid'; grid.classList.remove('list-view');
    document.getElementById('viewGrid').classList.add('active');
    document.getElementById('viewList').classList.remove('active');
    render();
  });
  document.getElementById('viewList')?.addEventListener('click', () => {
    viewMode='list'; grid.classList.add('list-view');
    document.getElementById('viewList').classList.add('active');
    document.getElementById('viewGrid').classList.remove('active');
    render();
  });
  document.getElementById('mobFilterToggle')?.addEventListener('click', () => {
    const sb=document.getElementById('sidebar'), ic=document.getElementById('mobFilterIcon');
    sb?.classList.toggle('mob-open');
    if(ic) ic.className = sb?.classList.contains('mob-open') ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
  });
  document.getElementById('resetBtn')?.addEventListener('click', window.resetAllFilters);

  updateCatUI();
  render();
}

/* ─────────────────────────────────────────── */
/* DETAIL PAGE                                */
/* ─────────────────────────────────────────── */
function initDetailPage() {
  const detailRoot = document.getElementById('detailRoot');
  if (!detailRoot) return;

  let qty = 1;
  const qtyNum = document.getElementById('qtyNum');
  document.getElementById('qtyMinus')?.addEventListener('click', () => {
    if (qty > 1) { qty--; if(qtyNum) qtyNum.textContent = qty; }
  });
  document.getElementById('qtyPlus')?.addEventListener('click', () => {
    qty++; if(qtyNum) qtyNum.textContent = qty;
  });

  const btnAdd = document.getElementById('btnAddCart');
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      const { id, name, price, img } = btnAdd.dataset;
      for (let i = 0; i < qty; i++) addToCart(id, name, Number(price), img);
    });
  }

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
    });
  });
}
