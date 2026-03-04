# 📱 UNIQ CELL — Website Toko dengan Eleventy + Decap CMS

Website toko UNIQ CELL dibangun dengan **Eleventy (11ty)** sebagai Static Site Generator dan **Decap CMS** sebagai headless CMS berbasis Git.

## 🏗️ Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| **SSG** | [Eleventy (11ty)](https://www.11ty.dev/) v3 |
| **Template Engine** | Nunjucks (`.njk`) |
| **CMS** | [Decap CMS](https://decapcms.org/) |
| **Deploy** | Vercel |
| **Authentication CMS** | GitHub OAuth |
| **Styling** | CSS (plain) |
| **Interaktif** | Vanilla JavaScript |

---

## 📁 Struktur Project

```
uniqcell/
├── src/
│   ├── _data/
│   │   └── site.json                ← 📌 Data toko (nama, WA, alamat, dll)
│   ├── _includes/
│   │   ├── base.njk                 ← Layout utama semua halaman
│   │   ├── product-detail.njk       ← Layout halaman detail produk
│   │   └── partials/
│   │       ├── navbar.njk           ← Navbar/header
│   │       ├── footer.njk           ← Footer
│   │       └── cart.njk             ← Shopping cart
│   ├── products/                    ← 📌 File markdown tiap produk (CRUD via CMS)
│   │   ├── lenovo-thinkpad-x1-carbon.md
│   │   ├── macbook-pro-14-m3-pro.md
│   │   └── ... (produk lainnya)
│   ├── css/
│   │   └── main.css                 ← Styling aplikasi
│   ├── js/
│   │   ├── cart.js                  ← Logic shopping cart
│   │   └── main.js                  ← Script utama
│   ├── admin/
│   │   ├── index.html               ← 📌 Interface Decap CMS
│   │   └── config.yml               ← 📌 Konfigurasi field CMS
│   ├── index.njk                    ← Halaman Home
│   └── products.njk                 ← Halaman Katalog Produk
├── _site/                           ← Output hasil build (auto-generated)
├── .eleventy.js                     ← Konfigurasi Eleventy
├── vercel.json                      ← Konfigurasi deploy Vercel
├── package.json                     ← Dependencies & scripts
└── README.md                        ← File ini
```

---

## 🚀 Quick Start - Setup & Install

### 1. Install Node.js & Git

Pastikan sudah install:
- **Node.js** v16+ ([download](https://nodejs.org/))
- **Git** ([download](https://git-scm.com/))

### 2. Clone Repository & Install Dependencies

```bash
git clone <repository-url> uniqcell
cd uniqcell
npm install
```

### 3. Run Development Server

```bash
npm start
# → Aplikasi berjalan di http://localhost:8080
# → Otomatis reload saat file diubah
```

**Command lainnya:**
```bash
npm run build          # Build production
npm run dev            # Dev dengan watch mode
```

---

## 💻 Cara EDIT File Aplikasi

### 1. Edit Data Toko (Nama, WA, Alamat, dll)

Edit file: **[src/_data/site.json](src/_data/site.json)**

```json
{
  "siteName": "UNIQ CELL",
  "siteDesc": "Toko Laptop, CCTV & Peralatan Jaringan Terpercaya",
  "waNumber": "6285755913524",
  "email": "sales@uniqcell.id",
  "address": "Jl. Masjid No.78, ...",
  "phone": "+62 857-5591-3524",
  "siteUrl": "https://uniq-cctv-network.vercel.app",
  "socials": {
    "whatsapp": "https://wa.me/6285755913524",
    "instagram": "https://instagram.com/uniqcell",
    "tiktok": "https://tiktok.com/@uniqcell"
  }
}
```

✅ **Simpan** → Eleventy otomatis rebuild → perubahan muncul di browser

---

### 2. Edit Layout Halaman (HTML/Template)

| File | Kegunaan |
|------|----------|
| [src/_includes/base.njk](src/_includes/base.njk) | Layout utama semua halaman |
| [src/_includes/partials/navbar.njk](src/_includes/partials/navbar.njk) | Header/Navbar |
| [src/_includes/partials/footer.njk](src/_includes/partials/footer.njk) | Footer |
| [src/index.njk](src/index.njk) | Halaman Home |
| [src/products.njk](src/products.njk) | Halaman Katalog Produk |

**Contoh edit navbar:**
```nunjucks
{# src/_includes/partials/navbar.njk #}
<nav class="navbar">
  <a href="/">{{ site.siteName }}</a>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/products/">Produk</a></li>
    <li><a href="tel:{{ site.phone }}">Hubungi</a></li>
  </ul>
</nav>
```

---

### 3. Edit Styling (CSS)

Edit file: **[src/css/main.css](src/css/main.css)**

```css
:root {
  --primary: #007bff;
  --secondary: #6c757d;
  --text: #333;
  --bg: #fff;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  color: var(--text);
  line-height: 1.6;
}
```

---

### 4. Edit JavaScript

Edit file: 
- **[src/js/main.js](src/js/main.js)** — Script umum
- **[src/js/cart.js](src/js/cart.js)** — Logic shopping cart

```javascript
// src/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Website loaded!');
  // Tambah logic di sini
});
```

---

## 📦 Cara Kelola Produk

### **Opsi 1: Via CMS (Recommended)**

1. Buka `https://your-site.com/admin/`
2. Klik **"Produk"** di sidebar
3. **Tambah** → New Produk → Isi field → Publish
4. **Edit** → Klik produk → Edit → Publish
5. **Hapus** → Klik produk → Delete

✨ Otomatis commit ke GitHub + rebuild otomatis!

---

### **Opsi 2: Manual (Edit File Langsung)**

**Buat produk baru:**

Buat file baru di `src/products/nama-produk.md`:

```markdown
---
layout: product-detail.njk
permalink: /products/nama-produk/
title: "Nama Produk"
slug: "nama-produk"
kategori: laptop   # atau: cctv / jaringan
img: "https://images.unsplash.com/photo-ID?w=800&q=80"
spec: "Spek singkat · untuk kartu produk"
price: 9999000
order: 10
rating: 4.8
ulasan: 50
stok: true
description: "Deskripsi SEO singkat."
specs:
  Prosesor: "Intel Core i7"
  RAM: "16 GB"
  Garansi: "1 Tahun"
---

Deskripsi lengkap produk dalam **Markdown**. Bisa pakai:
- **Bold**, *italic*, `code`
- Bullet points
- Link: [Beli](http://affiliate.com)

## Keunggulan
- Poin 1
- Poin 2
```

**Edit produk existing:**

Edit file yang sudah ada di `src/products/nama-produk.md` - ubah front matter (bagian antara `---`).

**Hapus produk:**

Cukup hapus file dari `src/products/`. Eleventy otomatis rebuild.

---

## 🔧 Setup Decap CMS (Opsional - untuk interface edit visual)

Decap CMS memungkinkan edit produk lewat interface tanpa edit file langsung.

### Step 1: Buat GitHub OAuth App

1. Buka [GitHub Developer Settings](https://github.com/settings/developers)
2. Klik **"New OAuth App"**
3. Isi form:
   - **Application name:** UNIQ CELL CMS
   - **Homepage URL:** `https://your-site.vercel.app`
   - **Callback URL:** `https://your-site.vercel.app/api/auth`
4. Catat **Client ID** & **Client Secret**

### Step 2: Edit Konfigurasi CMS

Edit file: **[src/admin/config.yml](src/admin/config.yml)**

```yaml
backend:
  name: github
  repo: YOUR_USERNAME/YOUR_REPO
  branch: main
  base_url: https://your-site.vercel.app

collections:
  - name: products
    label: Produk
    folder: src/products
    create: true
```

### Step 3: Setup OAuth Handler

Gunakan **[Netlify CMS GitHub OAuth Provider](https://github.com/vencax/netlify-cms-github-oauth-provider)** atau hosting di **[Netlify](https://www.netlify.com/)** (lebih mudah - sudah built-in CMS).

### Step 4: Akses CMS

```
https://your-site.vercel.app/admin/
```

---

## 🚀 Deploy & Production

### Deploy ke Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy ke production
vercel --prod
```

**Auto-deploy dari GitHub:**
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Connect GitHub repo
3. Build Command: `npm run build`
4. Output Directory: `_site`
5. Setiap push → otomatis deploy!

### Deploy ke Netlify

1. Buka [Netlify](https://app.netlify.com/)
2. **"New site from Git"** → Connect GitHub
3. Build Command: `npm run build`
4. Publish Directory: `_site`
5. Deploy!

---

## 🎨 Kustomisasi Tampilan

Edit `src/css/main.css` untuk ubah warna tema:

```css
:root {
  --navy:    #0b2b40;   /* Warna utama */
  --yellow:  #ffc107;   /* Aksen kuning */
  --green-wa:#25D366;   /* Hijau WhatsApp */
}
```

## 📞 Kontak

UNIQ CELL — Jl. Masjid No.78, Mojosari, Mojokerto, Jawa Timur  
WhatsApp: +62 857-5591-3524

---

## 📚 Dokumentasi Lengkap

- **Eleventy Docs:** https://www.11ty.dev/docs/
- **Nunjucks Template:** https://mozilla.github.io/nunjucks/
- **Decap CMS:** https://decapcms.org/docs/
- **Markdown Guide:** https://www.markdownguide.org/

---

## 🐛 Troubleshooting

### ❌ Port 8080 sudah digunakan

```bash
npx eleventy --serve --port=3000
```

### ❌ File tidak ter-rebuild

Stop server (`Ctrl+C`) dan jalankan ulang:
```bash
npm start
```

### ❌ Build error saat deploy

Pastikan:
- ✅ Node.js v16+ terinstall
- ✅ `npm install` sudah dijalankan
- ✅ `.eleventy.js` syntax benar
- ✅ Cek error log di Vercel/Netlify dashboard

### ❌ CMS tidak bisa login

- Pastikan OAuth App sudah dibuat di GitHub
- Pastikan **Callback URL** di GitHub OAuth sama dengan URL di `config.yml`
- Clear browser cache & refresh

### ❌ Gambar produk tidak muncul

- Pastikan URL gambar valid & bisa diakses dari browser
- Gunakan URL lengkap (dengan `https://`)
- Cek console browser (F12) untuk error URL

### ❌ Perubahan tidak muncul di production

- Pastikan sudah push ke GitHub
- Cek deploy status di Vercel/Netlify dashboard
- Refresh cache browser (Ctrl+Shift+R di Windows)

---

## ✨ Tips & Trik

### Mempercepat Development
```bash
npm start   # Hot reload otomatis
```

### Backup sebelum deploy
```bash
git commit -am "Backup sebelum deploy"
git push origin main
```

### Test produk baru locally
```bash
npm start
# Buka http://localhost:8080/products/
```

---

## 📋 Checklist Setup Awal

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Edit `src/_data/site.json` (info toko)
- [ ] Edit `src/_includes/partials/navbar.njk` (menu)
- [ ] Edit `src/_includes/partials/footer.njk` (link footer)
- [ ] Edit `src/css/main.css` (styling custom)
- [ ] Tambah produk di `src/products/`
- [ ] Test locally: `npm start`
- [ ] Deploy ke Vercel/Netlify
- [ ] Setup Decap CMS (opsional)
- [ ] Test CMS login

---

**Happy coding! 🚀**
