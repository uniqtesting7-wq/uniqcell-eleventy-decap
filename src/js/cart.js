/* ============================================================
   UNIQ CELL — Cart Module
   ============================================================ */

const fmt = n => 'Rp ' + Number(n).toLocaleString('id-ID');

let cart = JSON.parse(localStorage.getItem('uniqcell_cart') || '[]');

function saveCart() {
  localStorage.setItem('uniqcell_cart', JSON.stringify(cart));
  renderCart();
}

function addToCart(id, name, price, img) {
  const ex = cart.find(i => i.id === id);
  if (ex) {
    ex.qty++;
  } else {
    cart.push({ id, name, price, img, qty: 1 });
  }
  saveCart();
  showToast(name);
  const dot = document.getElementById('cartCount');
  if (dot) {
    dot.classList.remove('bump');
    void dot.offsetWidth;
    dot.classList.add('bump');
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function changeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) removeFromCart(id);
  else saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
}

function renderCart() {
  const count = cart.reduce((a, i) => a + i.qty, 0);
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);

  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearBtn = document.getElementById('clearBtn');
  const body = document.getElementById('cartBody');

  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = fmt(total);
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  if (clearBtn) clearBtn.disabled = cart.length === 0;

  if (!body) return;

  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty"><i class="bi bi-bag"></i><span>Keranjang kosong</span></div>`;
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" class="c-img" alt="${item.name}">
      <div style="flex:1">
        <div class="c-name">${item.name}</div>
        <div class="c-price">${fmt(item.price)}</div>
        <div class="c-qty">
          <button class="qty-btn" onclick="changeQty('${item.id}',-1)"><i class="bi bi-dash"></i></button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}',1)"><i class="bi bi-plus"></i></button>
          <button class="c-remove" onclick="removeFromCart('${item.id}')"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    </div>`).join('');
}

function checkoutViaWA() {
  if (!cart.length) return;
  const storeName = window.SITE_CONFIG?.storeName || 'UNIQ CELL';
  const waNumber  = window.SITE_CONFIG?.waNumber  || '6285755913524';
  let msg = `Halo *${storeName}*, saya ingin memesan:\n\n`;
  let total = 0;
  cart.forEach(i => {
    const s = i.price * i.qty;
    total += s;
    msg += `• ${i.name} ×${i.qty} = ${fmt(s)}\n`;
  });
  msg += `\n*Total: ${fmt(total)}*\n\nMohon konfirmasi, terima kasih!`;
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

function showToast(name) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = 'toast-card';
  el.innerHTML = `<span class="toast-ico"><i class="bi bi-bag-check-fill"></i></span><span class="toast-txt">${name} ditambahkan!</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 280);
  }, 3000);
}

// Init cart panel
document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  const panel   = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  const toggle  = document.getElementById('cartToggle');
  const close   = document.getElementById('cartClose');
  const checkout = document.getElementById('checkoutBtn');
  const clearBtn = document.getElementById('clearBtn');

  const openCart  = () => { panel?.classList.add('open'); overlay?.classList.add('open'); };
  const closeCart = () => { panel?.classList.remove('open'); overlay?.classList.remove('open'); };

  toggle?.addEventListener('click', openCart);
  close?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);
  checkout?.addEventListener('click', checkoutViaWA);
  clearBtn?.addEventListener('click', () => {
    if (confirm('Kosongkan keranjang?')) clearCart();
  });
});
