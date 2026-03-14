# Torang Bersih

<!-- Logo: letakkan file di docs/images/logo.png. Isi gambar: logo resmi Torang Bersih (ikon atau teks), background transparan atau selaras tema, rekomendasi lebar 200-400px -->
<p align="center">
  <img src="docs/images/logo.png" alt="Torang Bersih" width="280">
</p>

<p align="center">
  <strong>Laporkan. Pantau. Bergerak Bersama.</strong>
</p>

<p align="center">
  Satu platform untuk menghubungkan warga, komunitas, dan pemerintah dalam menjaga lingkungan Sulawesi Utara dari ancaman sampah.
</p>

---

## Daftar Isi

- [Tentang](#tentang)
- [Fitur Utama](#fitur-utama)
- [Preview](#preview)
- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Variabel Lingkungan](#variabel-lingkungan)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Dokumentasi API](#dokumentasi-api)
- [Skrip](#skrip)
- [Lisensi](#lisensi)

---

## Tentang

Torang Bersih adalah inisiatif digital yang bertujuan menciptakan Sulawesi Utara yang lebih bersih melalui kolaborasi masyarakat, komunitas, dan pemerintah daerah. Platform ini menyatukan pelaporan sampah ilegal, pemetaan aset kebersihan, registrasi kolaborator, marketplace barang daur ulang, dan konten edukasi dalam satu ekosistem berbasis peta.

**Cakupan:** Sulawesi Utara, Indonesia (kota hingga kabupaten).

---

## Fitur Utama

- **Laporan Sampah Ilegal** — Warga melaporkan titik pembuangan sampah liar dengan foto bukti, lokasi di peta, dan detail (jenis sampah, karakteristik, bentuk timbulan). Laporan memiliki siklus status dan tindak lanjut penanganan dengan dokumentasi foto sebelum-sesudah.
- **Kolaborator** — Komunitas, LSM, sekolah, instansi pemerintah, dan CSR mendaftar sebagai kolaborator. Profil terverifikasi tampil di daftar dan peta untuk memudahkan jejaring dan aksi bersama.
- **Aset Sampah** — Pencarian dan pemetaan fasilitas seperti bank sampah, TPS, TPST, composting, dan kendaraan pengangkut beserta kontak dan lokasi.
- **Barang Daur Ulang** — Marketplace barang bekas (plastik, kaca, logam, kertas, elektronik) dengan status ketersediaan dan lokasi penjual untuk mendorong ekonomi sirkular.
- **Peta Interaktif** — Satu peta dengan lapisan Kolaborator, Aset, Laporan Sampah, dan Barang Daur Ulang. Filter per kategori dan pencarian lokasi.
- **Artikel dan Edukasi** — Konten artikel (edukasi, berita, event, opini) dengan editor teks kaya untuk kampanye dan informasi lingkungan.
- **Dashboard** — Ringkasan statistik dan aktivitas untuk pengguna dan pengelola.

---

## Preview

Letakkan screenshot di folder `docs/images/`. Setelah file ada, gambar akan tampil di bawah.

**Landing page** — Hero "Laporkan. Pantau. Bergerak Bersama.", empat kartu fitur, CTA Daftar Kolaborator.

<!-- Isi gambar: landing page lengkap dengan hero dan kartu fitur. File: docs/images/landing-hero.png -->
<p align="center">
  <img src="docs/images/landing-hero.png" alt="Landing page Torang Bersih" width="800">
</p>

**Peta interaktif** — Sidebar filter dan peta dengan marker Kolaborator, Aset, Laporan Sampah, Barang Daur Ulang.

<!-- Isi gambar: halaman peta penuh dengan sidebar dan peta Sulawesi Utara. File: docs/images/peta-interaktif.png -->
<p align="center">
  <img src="docs/images/peta-interaktif.png" alt="Peta interaktif" width="800">
</p>

**Daftar screenshot lain** (opsional, isi file sesuai deskripsi):

- `docs/images/landing-tujuan.png` — Blok "Hadir untuk Sulawesi Utara" dan empat poin tujuan.
- `docs/images/laporan-daftar.png` — Daftar laporan dengan tab status, search, filter, kartu laporan.
- `docs/images/laporan-buat.png` — Wizard buat laporan (foto / lokasi / detail).
- `docs/images/kolaborator-daftar.png` — Daftar kolaborator dengan kartu profil.
- `docs/images/aset-daftar.png` — Daftar aset (bank sampah, TPS, dll).
- `docs/images/barang-bekas-daftar.png` — Grid barang bekas.
- `docs/images/dashboard-user.png` — Dashboard pengguna (statistik, panel status).
- `docs/images/dashboard-admin.png` — Dashboard admin (statistik agregat, aktivitas).
- `docs/images/artikel-daftar.png` — Daftar artikel publik.
- `docs/images/artikel-detail.png` — Detail artikel dengan like dan komentar.

---

## Teknologi

**Frontend:** React 19, Vite (rolldown-vite), React Router v7, Tailwind CSS v4, Axios, React Hot Toast, Leaflet / react-leaflet, Lucide React, React Icons, Google OAuth (@react-oauth/google).

**Backend:** Flask 3, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Flask-Cors, Flask-Limiter, Flask-Mail, Marshmallow, PostgreSQL (psycopg2-binary), Cloudinary, Gunicorn / Waitress.

---

## Struktur Proyek

```
Torang-Bersih/
├── fe/                    # Frontend (React SPA)
│   ├── src/
│   │   ├── components/    # Layouts, fitur publik/user/admin, shared, common
│   │   ├── contexts/      # Auth, theme, OAuth
│   │   ├── hooks/
│   │   ├── pages/         # Public, auth, user, admin
│   │   ├── services/      # API routes (axios)
│   │   └── utils/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── .env.example
├── be/                    # Backend (Flask API)
│   ├── app/
│   │   ├── api/           # controllers, routes, services
│   │   ├── config/
│   │   ├── database/models/
│   │   ├── middlewares/
│   │   ├── schemas/
│   │   └── utils/
│   ├── docs/
│   ├── scripts/
│   ├── tests/
│   ├── migrations/
│   ├── server.py
│   ├── requirements.txt
│   └── .env.example
├── docs/
│   └── images/            # Logo dan screenshot (logo.png, landing-hero.png, dll.)
└── README.md
```

---

## Prasyarat

- Node.js (frontend, disarankan LTS)
- Python 3.10+ (backend)
- PostgreSQL
- Akun Cloudinary (unggahan gambar)
- Opsional: Google Cloud (OAuth), SMTP (email)

---

## Instalasi

**1. Clone**

```bash
git clone https://github.com/<org>/Torang-Bersih.git
cd Torang-Bersih
```

**2. Backend**

```bash
cd be
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
cp .env.example .env
# Edit .env (database, JWT, mail, Cloudinary)

flask db upgrade
```

**3. Frontend**

```bash
cd fe
npm install
cp .env.example .env
# Edit .env: VITE_API_URL, VITE_GOOGLE_CLIENT_ID (opsional)
```

---

## Variabel Lingkungan

**Backend (`be/.env`):** `FLASK_ENV`, `PORT`, `HOST`, `SECRET_KEY`, `JWT_SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGINS`, `FRONTEND_URL`, `MAIL_*`, `CLOUDINARY_*`.

**Frontend (`fe/.env`):** `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`.

Detail nama variabel dan contoh nilai ada di `be/.env.example` dan `fe/.env.example`.

---

## Menjalankan Aplikasi

**Backend**

```bash
cd be
.venv\Scripts\activate
python server.py
```

API: `http://localhost:5000` (atau sesuai `HOST`/`PORT` di `.env`).

**Frontend**

```bash
cd fe
npm run dev
```

Web: `http://localhost:5173`. Pastikan `VITE_API_URL` mengarah ke backend.

**Production:** Backend `gunicorn server:app --bind 0.0.0.0:5000`. Frontend `npm run build` lalu deploy isi `dist/`.

---

## Dokumentasi API

- Detail endpoint: `be/docs/API.md` (jika ada).
- Koleksi request: `be/bruno/`.
- Health check: `GET /health` pada base URL backend.

---

## Skrip

```bash
# Seed database
cd be && python -m scripts.db.seed

# Buat admin baru
cd be && python -m scripts.db.create_admin

# Tes backend
cd be && pytest

# Lint frontend
cd fe && npm run lint && npm run format
```

---

## Lisensi

Proyek dikembangkan oleh Lasalle Vibers. Hak cipta dilindungi. Untuk penggunaan dan lisensi, hubungi pemilik repositori.

---

## Kontribusi

Silakan buka issue atau pull request. Ikuti struktur dan konvensi kode yang ada di backend dan frontend.
