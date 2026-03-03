# UNIQ CELL — Static Site with Decap CMS

Website toko UNIQ CELL dibangun dengan **Eleventy (11ty)** sebagai SSG dan **Decap CMS** sebagai headless CMS berbasis Git.

## 🏗️ Stack

| Layer | Teknologi |
|-------|-----------|
| SSG | [Eleventy (11ty)](https://www.11ty.dev/) v2 |
| Template Engine | Nunjucks (`.njk`) |
| CMS | [Decap CMS](https://decapcms.org/) (formerly Netlify CMS) |
| Deploy | Vercel |
| Auth CMS | GitHub OAuth |

## 📁 Struktur Project

```
uniqcell/
├── src/
│   ├── _data/
│   │   └── site.json          ← Data toko (nama, WA, alamat, dll)
│   ├── _includes/
│   │   ├── base.njk            ← Layout utama
│   │   ├── product-detail.njk  ← Layout halaman detail produk
│   │   └── partials/
│   │       ├── navbar.njk
│   │       ├── footer.njk
│   │       └── cart.njk
│   ├── products/               ← File markdown tiap produk (CRUD via CMS)
│   │   ├── lenovo-thinkpad-x1-carbon.md
│   │   └── ...
│   ├── css/
│   │   └── main.css
│   ├── js/
│   │   ├── cart.js
│   │   └── main.js
│   ├── admin/
│   │   ├── index.html          ← Decap CMS interface
│   │   └── config.yml          ← Konfigurasi field CMS ← EDIT INI
│   ├── index.njk               ← Halaman Home
│   └── products.njk            ← Halaman Katalog
├── .eleventy.js                ← Konfigurasi Eleventy
├── vercel.json                 ← Konfigurasi deploy Vercel
└── package.json
```

## 🚀 Setup & Deploy

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/uniqcell.git
cd uniqcell
npm install
```

### 2. Development

```bash
npm start
# → http://localhost:8080
```

### 3. Build

```bash
npm run build
# → output ke folder _site/
```

### 4. Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### 5. Setup Decap CMS (GitHub OAuth)

**A. Buat GitHub OAuth App:**
1. GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
2. **Homepage URL:** `https://your-site.vercel.app`
3. **Callback URL:** `https://your-site.vercel.app/api/auth`

**B. Edit `src/admin/config.yml`:**
```yaml
backend:
  name: github
  repo: YOUR_USERNAME/YOUR_REPO   # ← Ganti ini
  branch: main
  base_url: https://your-site.vercel.app   # ← Ganti ini
```

**C. Deploy OAuth handler ke Vercel:**

Tambah file `api/auth.js` dan `api/callback.js` dari [netlify-cms-github-oauth-provider](https://github.com/vencax/netlify-cms-github-oauth-provider), atau gunakan [alternatif Cloudflare Workers](https://github.com/i40west/netlify-cms-cloudflare-workers).

**Atau alternatif lebih mudah:** Gunakan **Netlify** sebagai host dengan Identity (CMS langsung bisa login tanpa setup OAuth manual).

### 6. Akses CMS

```
https://your-site.vercel.app/admin/
```

Login dengan akun GitHub yang punya akses ke repo.

## ✏️ Cara CRUD Produk

### Tambah Produk
1. Buka `/admin/`
2. Klik **"Produk"** di sidebar
3. Klik **"New Produk"**
4. Isi semua field
5. Klik **"Publish"** → commit otomatis ke GitHub → Vercel rebuild → produk muncul!

### Edit Produk
1. Buka `/admin/` → Produk
2. Klik produk yang mau diedit
3. Edit → Publish

### Hapus Produk
1. Buka `/admin/` → Produk
2. Klik produk → menu titik tiga → Delete

### Update Info Toko
1. Buka `/admin/` → Pengaturan Toko → Informasi Toko
2. Edit nama toko, WA, alamat, dll
3. Publish → otomatis update di seluruh website

## 📝 Tambah Produk Manual (tanpa CMS)

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

Deskripsi lengkap produk dalam **Markdown**.

## Keunggulan
- Poin 1
- Poin 2
```

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
