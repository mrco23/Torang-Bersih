"""
Database seeding script.
Run with: python -m scripts.db.seed
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app import create_app
from app.config.extensions import db
from app.database.models import (
    User, UserRole,
    RefJenisKolaborator, RefKategoriAset, RefJenisSampah,
    RefKategoriBarang, RefKategoriArtikel,
    Kolaborator, Aset, LaporanSampahIlegal, Karakteristik, BentukTimbulan,
    MarketplaceDaurUlang, KondisiBarang,
    TindakLanjutLaporan,
)
from app.utils.password import hash_password


# ============================================================
# USERS
# ============================================================
SEED_USERS = [
    {
        "email": "admin@example.com",
        "username": "admin",
        "password": "Admin123!",
        "full_name": "Administrator",
        "role": UserRole.ADMIN,
        "is_verified": True,
        "auth_provider": "local",
    },
    {
        "email": "user1@example.com",
        "username": "testuser1",
        "password": "User123!",
        "full_name": "Budi Santoso",
        "role": UserRole.USER,
        "is_verified": True,
        "auth_provider": "local",
    },
    {
        "email": "user2@example.com",
        "username": "testuser2",
        "password": "User123!",
        "full_name": "Siti Rahayu",
        "role": UserRole.USER,
        "is_verified": True,
        "auth_provider": "local",
    },
    {
        "email": "user3@example.com",
        "username": "testuser3",
        "password": "User123!",
        "full_name": "Ahmad Hidayat",
        "role": UserRole.USER,
        "is_verified": True,
        "auth_provider": "local",
    },
    {
        "email": "user4@example.com",
        "username": "testuser4",
        "password": "User123!",
        "full_name": "Dewi Lestari",
        "role": UserRole.USER,
        "is_verified": True,
        "auth_provider": "local",
    },
    {
        "email": "user5@example.com",
        "username": "testuser5",
        "password": "User123!",
        "full_name": "Rina Wulandari",
        "role": UserRole.USER,
        "is_verified": True,
        "auth_provider": "local",
    },
]


# ============================================================
# REFERENCE TABLES
# ============================================================
SEED_REF_JENIS_KOLABORATOR = [
    "Komunitas", "LSM", "Sekolah", "Instansi", "CSR"
]

SEED_REF_KATEGORI_ASET = [
    "Bank Sampah", "TPA", "Composting", "Kendaraan", "TPST"
]

SEED_REF_JENIS_SAMPAH = [
    "Organik", "Plastik", "Kaca", "Logam", "Tekstil", "B3", "Campuran"
]

SEED_REF_KATEGORI_BARANG = [
    "Plastik", "Kaca", "Logam", "Kertas", "Elektronik"
]

SEED_REF_KATEGORI_ARTIKEL = [
    "Edukasi", "Berita", "Event", "Opini"
]


# ============================================================
# SEEDER FUNCTIONS
# ============================================================
def seed_users():
    print("\n📌 Seeding Users...")
    created = 0
    user_ids = []

    for data in SEED_USERS:
        existing = db.session.query(User).filter_by(email=data["email"]).first()
        if existing:
            user_ids.append(existing.id)
            print(f"  Skip: {data['email']} sudah ada")
            continue

        user = User(
            email=data["email"],
            username=data["username"],
            password_hash=hash_password(data["password"]),
            full_name=data["full_name"],
            role=data["role"],
            is_verified=data["is_verified"],
            is_active=True,
            auth_provider=data["auth_provider"],
        )
        db.session.add(user)
        db.session.flush()
        user_ids.append(user.id)
        created += 1
        print(f"  Created: {data['email']} ({data['role'].value})")

    db.session.commit()
    print(f"  ✅ {created} users dibuat")
    return user_ids


def seed_referensi():
    print("\n📌 Seeding Referensi...")

    def _seed_ref(model, names, label):
        created = 0
        ids = []
        for name in names:
            existing = model.query.filter_by(nama=name).first()
            if existing:
                ids.append(existing.id)
                continue
            item = model(nama=name)
            db.session.add(item)
            db.session.flush()
            ids.append(item.id)
            created += 1
        db.session.commit()
        print(f"  {label}: {created} created")
        return ids

    jenis_kolaborator_ids = _seed_ref(RefJenisKolaborator, SEED_REF_JENIS_KOLABORATOR, "Jenis Kolaborator")
    kategori_aset_ids = _seed_ref(RefKategoriAset, SEED_REF_KATEGORI_ASET, "Kategori Aset")
    jenis_sampah_ids = _seed_ref(RefJenisSampah, SEED_REF_JENIS_SAMPAH, "Jenis Sampah")
    kategori_barang_ids = _seed_ref(RefKategoriBarang, SEED_REF_KATEGORI_BARANG, "Kategori Barang")
    kategori_artikel_ids = _seed_ref(RefKategoriArtikel, SEED_REF_KATEGORI_ARTIKEL, "Kategori Artikel")

    return {
        "jenis_kolaborator": jenis_kolaborator_ids,
        "kategori_aset": kategori_aset_ids,
        "jenis_sampah": jenis_sampah_ids,
        "kategori_barang": kategori_barang_ids,
        "kategori_artikel": kategori_artikel_ids,
    }


def seed_kolaborator(user_ids, ref_ids):
    print("\n📌 Seeding Kolaborator...")
    if Kolaborator.query.first():
        print("  Skip: sudah ada data")
        return

    jk_ids = ref_ids["jenis_kolaborator"]
    items = [
        Kolaborator(
            id_user=user_ids[1],
            nama_organisasi="Komunitas Peduli Sampah",
            jenis_kolaborator_id=jk_ids[0],
            deskripsi="Komunitas yang bergerak di bidang pengelolaan sampah berbasis masyarakat. " * 10,
            kabupaten_kota="Kota Bandung",
            alamat_lengkap="Jl. Merdeka No. 10, RT 05/RW 02, Kelurahan Braga",
            latitude=-6.9175,
            longitude=107.6191,
            penanggung_jawab="Budi Santoso",
            kontak="+6281234567890",
            email="komunitas@example.com",
        ),
        Kolaborator(
            id_user=user_ids[2],
            nama_organisasi="Yayasan Lingkungan Bersih",
            jenis_kolaborator_id=jk_ids[1],
            deskripsi="Yayasan nirlaba yang fokus pada pengelolaan limbah dan edukasi lingkungan. " * 10,
            kabupaten_kota="Kota Jakarta Selatan",
            alamat_lengkap="Jl. Sudirman No. 45, RT 03/RW 01",
            latitude=-6.2088,
            longitude=106.8456,
            penanggung_jawab="Siti Rahayu",
            kontak="+6289876543210",
            email="ylb@example.com",
        ),
        Kolaborator(
            id_user=user_ids[3],
            nama_organisasi="SMK Negeri 1 Eco School",
            jenis_kolaborator_id=jk_ids[2],
            deskripsi="Sekolah menengah kejuruan yang menerapkan program adiwiyata dan pengelolaan sampah mandiri. " * 8,
            kabupaten_kota="Kota Surabaya",
            alamat_lengkap="Jl. Pahlawan No. 20",
            latitude=-7.2575,
            longitude=112.7521,
            penanggung_jawab="Ahmad Hidayat",
            kontak="+6281122334455",
        ),
    ]

    for item in items:
        db.session.add(item)
    db.session.commit()
    print(f"  ✅ {len(items)} kolaborator dibuat")


def seed_aset(user_ids, ref_ids):
    print("\n📌 Seeding Aset...")
    if Aset.query.first():
        print("  Skip: sudah ada data")
        return

    ka_ids = ref_ids["kategori_aset"]
    items = [
        Aset(
            id_user=user_ids[1],
            nama_aset="Bank Sampah Sejahtera",
            kategori_aset_id=ka_ids[0],
            kabupaten_kota="Kota Bandung",
            alamat_lengkap="Jl. Cihampelas No. 88",
            latitude=-6.8973,
            longitude=107.6059,
            penanggung_jawab="Budi Santoso",
            kontak="+6281234567890",
        ),
        Aset(
            id_user=user_ids[2],
            nama_aset="TPA Cipatik",
            kategori_aset_id=ka_ids[1],
            kabupaten_kota="Kabupaten Bandung Barat",
            alamat_lengkap="Jl. Raya Cipatik Km 12",
            latitude=-6.8820,
            longitude=107.4880,
            penanggung_jawab="Agus Supriyadi",
            kontak="+6281555666777",
        ),
        Aset(
            id_user=user_ids[3],
            nama_aset="Rumah Kompos Green Village",
            kategori_aset_id=ka_ids[2],
            kabupaten_kota="Kota Surabaya",
            alamat_lengkap="Jl. Darmo Permai No. 5",
            latitude=-7.2916,
            longitude=112.7317,
            penanggung_jawab="Ahmad Hidayat",
            kontak="+6281122334455",
        ),
    ]

    for item in items:
        db.session.add(item)
    db.session.commit()
    print(f"  ✅ {len(items)} aset dibuat")


def seed_laporan(user_ids, ref_ids):
    print("\n📌 Seeding Laporan Sampah Ilegal...")
    if LaporanSampahIlegal.query.first():
        print("  Skip: sudah ada data")
        return

    js_ids = ref_ids["jenis_sampah"]
    items = [
        LaporanSampahIlegal(
            id_warga=user_ids[1],
            jenis_sampah_id=js_ids[1],  # Plastik
            foto_bukti_urls=["https://placehold.co/600x400?text=Sampah+Plastik"],
            latitude=-6.9200,
            longitude=107.6100,
            alamat_lokasi="Pinggir Sungai Cikapundung dekat Jembatan Pasupati",
            estimasi_berat_kg=50.0,
            karakteristik=Karakteristik.BISA_DIDAUR_ULANG,
            bentuk_timbulan=BentukTimbulan.MENUMPUK,
        ),
        LaporanSampahIlegal(
            id_warga=user_ids[2],
            jenis_sampah_id=js_ids[0],  # Organik
            foto_bukti_urls=["https://placehold.co/600x400?text=Sampah+Organik"],
            latitude=-6.2100,
            longitude=106.8450,
            alamat_lokasi="Dekat Pasar Minggu, belakang terminal",
            estimasi_berat_kg=30.0,
            karakteristik=Karakteristik.RESIDU,
            bentuk_timbulan=BentukTimbulan.TERCECER,
        ),
        LaporanSampahIlegal(
            id_warga=user_ids[3],
            jenis_sampah_id=js_ids[6],  # Campuran
            foto_bukti_urls=["https://placehold.co/600x400?text=Sampah+Campuran"],
            latitude=-7.2600,
            longitude=112.7500,
            alamat_lokasi="Lahan kosong sebelah Taman Bungkul",
            estimasi_berat_kg=100.0,
            karakteristik=Karakteristik.RESIDU,
            bentuk_timbulan=BentukTimbulan.MENUMPUK,
        ),
    ]

    for item in items:
        db.session.add(item)
    db.session.commit()
    print(f"  ✅ {len(items)} laporan dibuat")


def seed_marketplace(user_ids, ref_ids):
    print("\n📌 Seeding Marketplace Daur Ulang...")
    if MarketplaceDaurUlang.query.first():
        print("  Skip: sudah ada data")
        return

    kb_ids = ref_ids["kategori_barang"]
    items = [
        MarketplaceDaurUlang(
            id_penjual=user_ids[1],
            nama_barang="Botol Kaca Bekas Sirup",
            kategori_barang_id=kb_ids[1],  # Kaca
            deskripsi_barang="10 botol kaca bekas sirup, masih utuh dan bersih. Cocok untuk kerajinan.",
            harga=25000,
            berat_estimasi_kg=5.0,
            kondisi=KondisiBarang.LAYAK_PAKAI,
            foto_barang_urls=["https://placehold.co/600x400?text=Botol+Kaca"],
            latitude=-6.9175,
            longitude=107.6191,
        ),
        MarketplaceDaurUlang(
            id_penjual=user_ids[2],
            nama_barang="Tumpukan Kardus Bekas",
            kategori_barang_id=kb_ids[3],  # Kertas
            deskripsi_barang="Kardus bekas pindahan, total sekitar 15kg. Masih kokoh.",
            harga=0,  # Donasi
            berat_estimasi_kg=15.0,
            kondisi=KondisiBarang.LAYAK_PAKAI,
            foto_barang_urls=["https://placehold.co/600x400?text=Kardus+Bekas"],
            latitude=-6.2088,
            longitude=106.8456,
        ),
        MarketplaceDaurUlang(
            id_penjual=user_ids[3],
            nama_barang="Laptop Rusak untuk Sparepart",
            kategori_barang_id=kb_ids[4],  # Elektronik
            deskripsi_barang="Laptop lama, layar rusak tapi motherboard masih bagus. Bisa untuk spare part.",
            harga=150000,
            berat_estimasi_kg=2.5,
            kondisi=KondisiBarang.BUTUH_PERBAIKAN,
            foto_barang_urls=["https://placehold.co/600x400?text=Laptop+Bekas"],
            latitude=-7.2575,
            longitude=112.7521,
        ),
        MarketplaceDaurUlang(
            id_penjual=user_ids[4],
            nama_barang="Kaleng Aluminium Bekas",
            kategori_barang_id=kb_ids[2],  # Logam
            deskripsi_barang="Kaleng minuman aluminium bekas, sudah dicuci dan dipress.",
            harga=35000,
            berat_estimasi_kg=8.0,
            kondisi=KondisiBarang.RONGSOKAN,
            foto_barang_urls=["https://placehold.co/600x400?text=Kaleng+Aluminium"],
            latitude=-6.9200,
            longitude=107.6100,
        ),
    ]

    for item in items:
        db.session.add(item)
    db.session.commit()
    print(f"  ✅ {len(items)} barang marketplace dibuat")


# ============================================================
# MAIN
# ============================================================
def run_seed():
    app = create_app()
    with app.app_context():
        print("=" * 50)
        print("🌱 Database Seeding — Proxo Coris")
        print("=" * 50)
        db.create_all()

        user_ids = seed_users()
        ref_ids = seed_referensi()
        seed_kolaborator(user_ids, ref_ids)
        seed_aset(user_ids, ref_ids)
        seed_laporan(user_ids, ref_ids)
        seed_marketplace(user_ids, ref_ids)

        print("\n" + "=" * 50)
        print("🎉 Seeding selesai!")
        print("=" * 50)


if __name__ == "__main__":
    run_seed()