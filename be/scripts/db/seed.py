"""
Database seeding script.
Run with: python -m scripts.db.seed
"""
import sys
import os
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app import create_app
from app.config.extensions import db
from app.database.models import (
    User, UserRole,
    RefJenisKolaborator, RefKategoriAset, RefJenisSampah,
    RefKategoriBarang, RefKategoriArtikel,
    Kolaborator, StatusVerifikasiKolaborator,
    Aset, StatusVerifikasiAset,
    LaporanSampahIlegal, Karakteristik, BentukTimbulan, StatusLaporan,
    MarketplaceDaurUlang, KondisiBarang, StatusKetersediaan,
    TindakLanjutLaporan,
    Artikel, ArtikelLike, ArtikelKomentar, StatusPublikasi, StatusKomentar,
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
        "avatar_url": "https://i.pravatar.cc/150?img=1",
    },
    {
        "email": "user1@example.com",
        "username": "testuser1",
        "password": "User123!",
        "full_name": "Budi Santoso",
        "role": UserRole.USER,
        "is_verified": True,
        "auth_provider": "local",
        "avatar_url": "https://i.pravatar.cc/150?img=2",
    },
    {
        "email": "user2@example.com",
        "username": "testuser2",
        "password": "User123!",
        "full_name": "Siti Rahayu",
        "role": UserRole.USER,
        "is_verified": True,
        "auth_provider": "local",
        "avatar_url": "https://i.pravatar.cc/150?img=3",
    },
    {
        "email": "user3@example.com",
        "username": "testuser3",
        "password": "User123!",
        "full_name": "Ahmad Ridho Wael",
        "role": UserRole.USER,
        "is_verified": True,
        "auth_provider": "local",
        "avatar_url": "https://i.pravatar.cc/150?img=4",
    },
    {
        "email": "user4@example.com",
        "username": "testuser4",
        "password": "User123!",
        "full_name": "Dewi Lestari",
        "role": UserRole.USER,
        "is_verified": True,
        "auth_provider": "local",
        "avatar_url": "https://i.pravatar.cc/150?img=5",
    },
    {
        "email": "user5@example.com",
        "username": "testuser5",
        "password": "User123!",
        "full_name": "Rina Wulandari",
        "role": UserRole.USER,
        "is_verified": True,
        "auth_provider": "local",
        "avatar_url": "https://i.pravatar.cc/150?img=6",
    },
]


# ============================================================
# REFERENCE TABLES
# ============================================================
SEED_REF_JENIS_KOLABORATOR = [
    "Komunitas", "LSM", "Sekolah", "Instansi Pemerintah", "CSR"
]

SEED_REF_KATEGORI_ASET = [
    "Bank Sampah", "TPA", "Composting", "Kendaraan Pengangkut", "TPST"
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
            avatar_url=data.get("avatar_url"),
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
    now = datetime.now(timezone.utc)
    items = [
        # TERVERIFIKASI oleh admin
        Kolaborator(
            id_user=user_ids[1],
            nama_organisasi="Komunitas Peduli Sampah",
            jenis_kolaborator_id=jk_ids[0],  # Komunitas
            deskripsi=(
                "Komunitas yang bergerak di bidang pengelolaan sampah berbasis masyarakat. "
                "Kami aktif mengadakan edukasi, pengumpulan sampah sukarela, dan bekerja sama dengan pemerintah daerah."
            ),
            logo_url="https://placehold.co/200x200?text=KPS",
            email="komunitas@example.com",
            kabupaten_kota="Kota Manado",
            alamat_lengkap="Jl. Piere Tendean No. 10, Boulevard, Kecamatan Sario",
            latitude=1.4828,
            longitude=124.8328,
            penanggung_jawab="Budi Santoso",
            kontak="+6281234567890",
            sosmed="https://instagram.com/komunitaspedulisampah",
            status_aktif=True,
            status_verifikasi=StatusVerifikasiKolaborator.TERVERIFIKASI,
            id_admin_verifikator=user_ids[0],
            catatan_verifikasi="Dokumen lengkap, sudah diverifikasi.",
            waktu_verifikasi=now - timedelta(days=10),
        ),
        # TERVERIFIKASI
        Kolaborator(
            id_user=user_ids[2],
            nama_organisasi="Yayasan Lingkungan Bersih",
            jenis_kolaborator_id=jk_ids[1],  # LSM
            deskripsi=(
                "Yayasan nirlaba yang fokus pada pengelolaan limbah dan edukasi lingkungan. "
                "Beroperasi aktif di Jakarta dan sekitarnya sejak 2010."
            ),
            logo_url="https://placehold.co/200x200?text=YLB",
            email="ylb@example.com",
            kabupaten_kota="Kota Tomohon",
            alamat_lengkap="Jl. Raya Tomohon-Manado, Kelurahan Kakaskasen",
            latitude=1.3269,
            longitude=124.8409,
            penanggung_jawab="Siti Rahayu",
            kontak="+6289876543210",
            sosmed="https://instagram.com/yayasanlingkunganbersih",
            status_aktif=True,
            status_verifikasi=StatusVerifikasiKolaborator.TERVERIFIKASI,
            id_admin_verifikator=user_ids[0],
            catatan_verifikasi="Legalitas yayasan terkonfirmasi.",
            waktu_verifikasi=now - timedelta(days=5),
        ),
        # MENUNGGU
        Kolaborator(
            id_user=user_ids[3],
            nama_organisasi="SMK Negeri 1 Eco School",
            jenis_kolaborator_id=jk_ids[2],  # Sekolah
            deskripsi=(
                "Sekolah menengah kejuruan yang menerapkan program adiwiyata dan pengelolaan sampah mandiri. "
                "Siswa aktif dalam kegiatan pilah sampah dan kompos setiap minggunya."
            ),
            logo_url="https://placehold.co/200x200?text=SMK1",
            email="asd@example.com",
            kabupaten_kota="Kota Bitung",
            alamat_lengkap="Jl. Sam Ratulangi No. 20, Madidir",
            latitude=1.4455,
            longitude=125.1837,
            penanggung_jawab="Ahmad Hidayat",
            kontak="+6281122334455",
            status_aktif=True,
            status_verifikasi=StatusVerifikasiKolaborator.MENUNGGU,
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
    now = datetime.now(timezone.utc)
    items = [
        # TERVERIFIKASI
        Aset(
            id_user=user_ids[1],
            nama_aset="Bank Sampah Sejahtera",
            kategori_aset_id=ka_ids[0],  # Bank Sampah
            deskripsi_aset="Bank sampah yang mengelola sampah organik dan anorganik.",
            status_aktif=True,
            kabupaten_kota="Kabupaten Minahasa Utara",
            alamat_lengkap="Jl. Raya Manado-Bitung, Airmadidi",
            latitude=1.4252,
            longitude=124.9750,
            penanggung_jawab="Budi Santoso",
            kontak="+6281234567890",
            pictures_urls=[
                "https://placehold.co/600x400?text=Bank+Sampah+1",
                "https://placehold.co/600x400?text=Bank+Sampah+2",
            ],
            status_verifikasi=StatusVerifikasiAset.TERVERIFIKASI,
            id_admin_verifikator=user_ids[0],
            catatan_verifikasi="Aset terkonfirmasi aktif beroperasi.",
            waktu_verifikasi=now - timedelta(days=7),
        ),
        # TERVERIFIKASI
        Aset(
            id_user=user_ids[2],
            nama_aset="TPA Cipatik",
            kategori_aset_id=ka_ids[1],  # TPA
            deskripsi_aset="TPA yang mengelola sampah organik dan anorganik.",
            status_aktif=True,
            kabupaten_kota="Kabupaten Minahasa",
            alamat_lengkap="Jl. Siswa Tondano, Tondano Barat",
            latitude=1.3060,
            longitude=124.9083,
            penanggung_jawab="Agus Supriyadi",
            kontak="+6281555666777",
            pictures_urls=[
                "https://placehold.co/600x400?text=TPA+Cipatik",
            ],
            status_verifikasi=StatusVerifikasiAset.TERVERIFIKASI,
            id_admin_verifikator=user_ids[0],
            catatan_verifikasi="Dokumen izin operasional sudah dikonfirmasi.",
            waktu_verifikasi=now - timedelta(days=3),
        ),
        # MENUNGGU
        Aset(
            id_user=user_ids[3],
            nama_aset="Rumah Kompos Green Village",
            kategori_aset_id=ka_ids[2],  # Composting
            deskripsi_aset="Rumah kompos yang mengelola sampah organik dan anorganik.",
            status_aktif=True,
            kabupaten_kota="Kota Kotamobagu",
            alamat_lengkap="Jl. Ahmad Yani No. 5, Kotamobagu Barat",
            latitude=0.7303,
            longitude=124.3168,
            penanggung_jawab="Ahmad Hidayat",
            kontak="+6281122334455",
            pictures_urls=[
                "https://placehold.co/600x400?text=Rumah+Kompos",
            ],
            status_verifikasi=StatusVerifikasiAset.MENUNGGU,
        ),
    ]

    for item in items:
        db.session.add(item)
    db.session.commit()
    print(f"  ✅ {len(items)} aset dibuat")


def seed_laporan(user_ids, ref_ids):
    print("\n📌 Seeding Laporan Sampah Ilegal...")
    existing = LaporanSampahIlegal.query.all()
    if existing:
        print("  Skip: sudah ada data")
        return [item.id for item in existing]

    js_ids = ref_ids["jenis_sampah"]
    now = datetime.now(timezone.utc)
    items = [
        # MENUNGGU - belum diverifikasi
        LaporanSampahIlegal(
            id_warga=user_ids[1],
            jenis_sampah_id=js_ids[1],  # Plastik
            foto_bukti_urls=[
                "https://placehold.co/600x400?text=Bukti+Plastik+1",
                "https://placehold.co/600x400?text=Bukti+Plastik+2",
            ],
            latitude=1.1873,
            longitude=124.5772,
            kabupaten_kota="Kabupaten Minahasa Selatan",
            alamat_lokasi="Pinggir Pantai Amurang, Kawasan Pelabuhan",
            estimasi_berat_kg=50.0,
            karakteristik=Karakteristik.BISA_DIDAUR_ULANG,
            bentuk_timbulan=BentukTimbulan.MENUMPUK,
            deskripsi_laporan=(
                "Terdapat tumpukan sampah plastik yang cukup besar di pinggir sungai. "
                "Sampah berupa botol plastik, kantong kresek, dan berbagai kemasan plastik lainnya."
            ),
            status_laporan=StatusLaporan.MENUNGGU,
        ),
        # DITERIMA - sudah diverifikasi admin
        LaporanSampahIlegal(
            id_warga=user_ids[2],
            jenis_sampah_id=js_ids[0],  # Organik
            foto_bukti_urls=[
                "https://placehold.co/600x400?text=Bukti+Organik+1",
            ],
            latitude=1.4965,
            longitude=124.8427,
            kabupaten_kota="Kota Manado",
            alamat_lokasi="Samping Jembatan Soekarno, dekat Pasar Bersehati",
            estimasi_berat_kg=30.0,
            karakteristik=Karakteristik.RESIDU,
            bentuk_timbulan=BentukTimbulan.TERCECER,
            deskripsi_laporan=(
                "Sampah organik berserakan di lahan kosong dekat pasar. "
                "Sudah menimbulkan bau tidak sedap dan mengundang lalat."
            ),
            status_laporan=StatusLaporan.DITERIMA,
            id_admin_verifikator=user_ids[0],
            catatan_verifikasi="Laporan valid, lokasi terkonfirmasi.",
            waktu_verifikasi=now - timedelta(days=2),
        ),
        # DITINDAK - sudah ada tindak lanjut
        LaporanSampahIlegal(
            id_warga=user_ids[3],
            jenis_sampah_id=js_ids[6],  # Campuran
            foto_bukti_urls=[
                "https://placehold.co/600x400?text=Bukti+Campuran+1",
                "https://placehold.co/600x400?text=Bukti+Campuran+2",
                "https://placehold.co/600x400?text=Bukti+Campuran+3",
            ],
            latitude=1.0594,
            longitude=124.7937,
            kabupaten_kota="Kabupaten Minahasa Tenggara",
            alamat_lokasi="Lahan kosong di Ratahan dekat Pasar Baru",
            estimasi_berat_kg=100.0,
            karakteristik=Karakteristik.RESIDU,
            bentuk_timbulan=BentukTimbulan.MENUMPUK,
            deskripsi_laporan=(
                "Lahan kosong ini dimanfaatkan warga tidak bertanggung jawab sebagai tempat buang sampah. "
                "Timbulan sudah sangat tinggi dan diperkirakan mencapai 100 kg lebih."
            ),
            status_laporan=StatusLaporan.DITINDAK,
            id_admin_verifikator=user_ids[0],
            catatan_verifikasi="Darurat, perlu penanganan segera.",
            waktu_verifikasi=now - timedelta(days=4),
        ),
        # DITOLAK - tidak valid
        LaporanSampahIlegal(
            id_warga=user_ids[4],
            jenis_sampah_id=js_ids[3],  # Logam
            foto_bukti_urls=[
                "https://placehold.co/600x400?text=Bukti+Logam",
            ],
            latitude=1.3344,
            longitude=124.8471,
            kabupaten_kota="Kota Tomohon",
            alamat_lokasi="Pinggir Jalan Lingkar Timur Tomohon, dekat Pasar Beriman",
            estimasi_berat_kg=10.0,
            karakteristik=Karakteristik.BISA_DIDAUR_ULANG,
            bentuk_timbulan=BentukTimbulan.TERCECER,
            deskripsi_laporan="Terdapat beberapa kaleng bekas di pinggir jalan.",
            status_laporan=StatusLaporan.DITOLAK,
            id_admin_verifikator=user_ids[0],
            catatan_verifikasi="Volume terlalu kecil dan bukan kategori sampah ilegal, sudah ada petugas kebersihan setempat.",
            waktu_verifikasi=now - timedelta(days=1),
        ),
        # SELESAI
        LaporanSampahIlegal(
            id_warga=user_ids[5],
            jenis_sampah_id=js_ids[4],  # Tekstil
            foto_bukti_urls=[
                "https://placehold.co/600x400?text=Bukti+Tekstil",
            ],
            latitude=1.4552,
            longitude=125.1970,
            kabupaten_kota="Kota Bitung",
            alamat_lokasi="Dekat Pelabuhan Samudera Bitung, Aertembaga",
            estimasi_berat_kg=20.0,
            karakteristik=Karakteristik.BISA_DIDAUR_ULANG,
            bentuk_timbulan=BentukTimbulan.MENUMPUK,
            deskripsi_laporan="Tumpukan pakaian bekas dan kain perca di tepi sungai.",
            status_laporan=StatusLaporan.SELESAI,
            id_admin_verifikator=user_ids[0],
            catatan_verifikasi="Laporan valid, segera tangani.",
            waktu_verifikasi=now - timedelta(days=14),
        ),
    ]

    for item in items:
        db.session.add(item)
    db.session.commit()
    print(f"  ✅ {len(items)} laporan dibuat")
    return [item.id for item in items]


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
            deskripsi_barang=(
                "10 botol kaca bekas sirup, masih utuh dan bersih. "
                "Cocok untuk kerajinan tangan atau diisi ulang. Siap diambil langsung."
            ),
            harga=25000,
            berat_estimasi_kg=5.0,
            kondisi=KondisiBarang.LAYAK_PAKAI,
            kontak="08123456789",
            foto_barang_urls=[
                "https://placehold.co/600x400?text=Botol+Kaca+1",
                "https://placehold.co/600x400?text=Botol+Kaca+2",
            ],
            latitude=1.4870,
            longitude=124.8398,
            kabupaten_kota="Kota Manado",
            alamat_lengkap="Jl. Sam Ratulangi No. 115, Wenang",
            status_ketersediaan=StatusKetersediaan.TERSEDIA,
        ),
        MarketplaceDaurUlang(
            id_penjual=user_ids[2],
            nama_barang="Tumpukan Kardus Bekas",
            kategori_barang_id=kb_ids[3],  # Kertas
            deskripsi_barang=(
                "Kardus bekas pindahan, total sekitar 15kg. Masih kokoh dan bisa digunakan kembali. "
                "Bisa untuk packing, kerajinan, atau dijual ke pengepul."
            ),
            harga=0,  # Donasi / gratis
            berat_estimasi_kg=15.0,
            kondisi=KondisiBarang.LAYAK_PAKAI,
            kontak="08123456789",
            foto_barang_urls=[
                "https://placehold.co/600x400?text=Kardus+Bekas",
            ],
            latitude=1.3146,
            longitude=124.8370,
            kabupaten_kota="Kota Tomohon",
            alamat_lengkap="Jl. Sineleyan, Walian, Tomohon Selatan",
            status_ketersediaan=StatusKetersediaan.TERSEDIA,
        ),
        MarketplaceDaurUlang(
            id_penjual=user_ids[3],
            nama_barang="Laptop Rusak untuk Sparepart",
            kategori_barang_id=kb_ids[4],  # Elektronik
            deskripsi_barang=(
                "Laptop lama merek Asus, layar rusak tapi motherboard dan RAM masih bagus. "
                "Bisa untuk spare part atau upgrade komputer lain. Baterai masih bisa charge."
            ),
            harga=150000,
            berat_estimasi_kg=2.5,
            kondisi=KondisiBarang.BUTUH_PERBAIKAN,
            kontak="08123456789",
            foto_barang_urls=[
                "https://placehold.co/600x400?text=Laptop+Bekas",
            ],
            latitude=1.4251,
            longitude=125.0189,
            kabupaten_kota="Kabupaten Minahasa Utara",
            alamat_lengkap="Kauditan, pinggir jalan raya utama",
            status_ketersediaan=StatusKetersediaan.TERSEDIA,
        ),
        MarketplaceDaurUlang(
            id_penjual=user_ids[4],
            nama_barang="Kaleng Aluminium Bekas",
            kategori_barang_id=kb_ids[2],  # Logam
            deskripsi_barang=(
                "Kaleng minuman aluminium bekas, sudah dicuci bersih dan dipress tipis. "
                "Sekitar 200 buah, sudah ditimbang total 8kg. Harga 35rb/kg."
            ),
            harga=280000,
            berat_estimasi_kg=8.0,
            kondisi=KondisiBarang.RONGSOKAN,
            kontak="08123456789",
            foto_barang_urls=[
                "https://placehold.co/600x400?text=Kaleng+Aluminium",
            ],
            latitude=0.7340,
            longitude=124.3130,
            kabupaten_kota="Kota Kotamobagu",
            alamat_lengkap="Jl. Datoe Binangkang No. 8, Kotamobagu",
            status_ketersediaan=StatusKetersediaan.TERSEDIA,
        ),
        MarketplaceDaurUlang(
            id_penjual=user_ids[5],
            nama_barang="Botol Plastik PET (Sudah Dipilah)",
            kategori_barang_id=kb_ids[0],  # Plastik
            deskripsi_barang=(
                "Botol plastik PET sudah dipilah dan dibersihkan. Sekitar 5kg. "
                "Cocok untuk dijual ke pengepul atau didaur ulang langsung."
            ),
            harga=15000,
            berat_estimasi_kg=5.0,
            kondisi=KondisiBarang.RONGSOKAN,
            kontak="08123456789",
            foto_barang_urls=[
                "https://placehold.co/600x400?text=Botol+PET",
            ],
            latitude=1.2588,
            longitude=124.8872,
            kabupaten_kota="Kabupaten Minahasa",
            alamat_lengkap="Dekat Danau Tondano, Remboken",
            status_ketersediaan=StatusKetersediaan.DIPESAN,
        ),
    ]

    for item in items:
        db.session.add(item)
    db.session.commit()
    print(f"  ✅ {len(items)} barang marketplace dibuat")


def seed_tindak_lanjut(user_ids, laporan_ids):
    print("\n📌 Seeding Tindak Lanjut Laporan...")
    if TindakLanjutLaporan.query.first():
        print("  Skip: sudah ada data")
        return

    # laporan_ids urutan: [MENUNGGU, DITERIMA, DITINDAK, DITOLAK, SELESAI]
    # Hanya laporan DITERIMA (idx 1), DITINDAK (idx 2), dan SELESAI (idx 4) yang bisa ditindaklanjuti
    items = [
        # Tindak lanjut untuk laporan DITERIMA (idx 1)
        TindakLanjutLaporan(
            id_laporan=laporan_ids[1],
            id_user_penindak=user_ids[4],
            tindak_lanjut_penanganan="Membersihkan sebagian sampah organik dan memisahkannya ke kantong sampah organik.",
            tim_penindak="Dewi Lestari + 5 relawan warga RT 04",
            foto_sebelum_tindakan_urls=[
                "https://placehold.co/600x400?text=Sebelum+1",
            ],
            foto_setelah_tindakan_urls=[
                "https://placehold.co/600x400?text=Setelah+1",
            ],
            catatan="Sudah bersih sekitar 30%. Butuh bantuan truk sampah untuk mengangkut sisanya.",
        ),
        # Tindak lanjut 1 untuk laporan DITINDAK (idx 2)
        TindakLanjutLaporan(
            id_laporan=laporan_ids[2],
            id_user_penindak=user_ids[5],
            tindak_lanjut_penanganan="Gotong royong warga membersihkan area lahan kosong setiap Minggu pagi.",
            tim_penindak="Rina Wulandari + Karang Taruna RT 07",
            foto_sebelum_tindakan_urls=[
                "https://placehold.co/600x400?text=Sebelum+Gotong+Royong",
            ],
            foto_setelah_tindakan_urls=[
                "https://placehold.co/600x400?text=Setelah+Gotong+Royong+1",
                "https://placehold.co/600x400?text=Setelah+Gotong+Royong+2",
            ],
            catatan="Sudah bersih 60%. Masih ada tumpukan di pojok barat.",
        ),
        # Tindak lanjut 2 untuk laporan DITINDAK (idx 2)
        TindakLanjutLaporan(
            id_laporan=laporan_ids[2],
            id_user_penindak=user_ids[1],
            tindak_lanjut_penanganan="Sewa kontainer sampah untuk mengangkut tumpukan sisa yang besar.",
            tim_penindak="Budi Santoso + Komunitas Peduli Sampah",
            foto_setelah_tindakan_urls=[
                "https://placehold.co/600x400?text=Kontainer+Sampah",
            ],
            catatan="Kontainer sudah diangkut dinas. Proses selesai 80%.",
        ),
        # Tindak lanjut untuk laporan SELESAI (idx 4)
        TindakLanjutLaporan(
            id_laporan=laporan_ids[4],
            id_user_penindak=user_ids[3],
            tindak_lanjut_penanganan="Bekerjasama dengan pengepul tekstil untuk mengambil dan mengolah kain-kain bekas.",
            tim_penindak="Ahmad Hidayat + Mitra Pengepul Tekstil",
            foto_sebelum_tindakan_urls=[
                "https://placehold.co/600x400?text=Sebelum+Tekstil",
            ],
            foto_setelah_tindakan_urls=[
                "https://placehold.co/600x400?text=Setelah+Tekstil+1",
                "https://placehold.co/600x400?text=Setelah+Tekstil+2",
            ],
            catatan="Semua tekstil sudah diangkut pengepul. Lokasi bersih total.",
        ),
    ]

    for item in items:
        db.session.add(item)
    db.session.commit()
    print(f"  ✅ {len(items)} tindak lanjut dibuat")


def seed_artikel(user_ids, ref_ids):
    print("\n📌 Seeding Artikel, Likes, dan Komentar...")
    if Artikel.query.first():
        print("  Skip: sudah ada data")
        return

    ka_ids = ref_ids["kategori_artikel"]
    now = datetime.now(timezone.utc)

    # ── Artikel ──
    artikel_list = [
        Artikel(
            id_penulis=user_ids[0],  # Admin
            judul_artikel="Cara Mengelola Sampah Plastik di Rumah dengan Mudah",
            slug="cara-mengelola-sampah-plastik-di-rumah",
            kategori_id=ka_ids[0],  # Edukasi
            konten_teks=(
                "<h2>Mengapa Penting?</h2>"
                "<p>Sampah plastik merupakan salah satu masalah lingkungan terbesar. "
                "Setiap hari rumah tangga menghasilkan ratusan gram sampah plastik.</p>"
                "<h2>Langkah Mudah di Rumah</h2>"
                "<ol><li>Pisahkan sampah plastik dari sampah organik</li>"
                "<li>Cuci bersih botol dan kemasan sebelum dibuang</li>"
                "<li>Press kemasan untuk menghemat tempat</li>"
                "<li>Kumpulkan dan setor ke bank sampah terdekat</li></ol>"
            ),
            foto_cover_url="https://placehold.co/800x400?text=Sampah+Plastik",
            status_publikasi=StatusPublikasi.PUBLISHED,
            jumlah_views=150,
            waktu_publish=now - timedelta(days=15),
        ),
        Artikel(
            id_penulis=user_ids[0],  # Admin
            judul_artikel="Event Gotong Royong Citarum Harum: Bersama Bersihkan Sungai",
            slug="event-gotong-royong-citarum-harum",
            kategori_id=ka_ids[2],  # Event
            konten_teks=(
                "<p>Mari bergabung dalam acara gotong royong membersihkan sungai Citarum "
                "pada hari Minggu ini di Jembatan Citarum, Bandung.</p>"
                "<p>Acara ini diselenggarakan oleh Komunitas Peduli Sampah bekerja sama "
                "dengan Dinas Lingkungan Hidup Kota Bandung.</p>"
                "<h3>Detail Acara</h3>"
                "<ul><li>Hari: Minggu, 15 Maret 2026</li>"
                "<li>Pukul: 07.00 - 11.00 WIB</li>"
                "<li>Lokasi: Jembatan Citarum, Bandung</li>"
                "<li>Bawa: Sarung tangan, sepatu boot, dan semangat!</li></ul>"
            ),
            foto_cover_url="https://placehold.co/800x400?text=Gotong+Royong+Citarum",
            status_publikasi=StatusPublikasi.PUBLISHED,
            jumlah_views=320,
            waktu_publish=now - timedelta(days=7),
        ),
        Artikel(
            id_penulis=user_ids[1],  # User biasa
            judul_artikel="Pentingnya Bank Sampah di Lingkungan RT",
            slug="pentingnya-bank-sampah-di-lingkungan-rt",
            kategori_id=ka_ids[3],  # Opini
            konten_teks=(
                "<p>Dari pengalaman saya sejak 2 tahun lalu mendirikan bank sampah di RT kami, "
                "dampaknya luar biasa. Volume sampah yang dibawa ke TPS turun hampir 40%.</p>"
                "<p>Selain itu, warga juga mendapat penghasilan tambahan dari hasil tabungan sampah "
                "yang bisa ditukar dengan uang atau kebutuhan pokok.</p>"
            ),
            foto_cover_url="https://placehold.co/800x400?text=Bank+Sampah+RT",
            status_publikasi=StatusPublikasi.PUBLISHED,
            jumlah_views=45,
            waktu_publish=now - timedelta(days=3),
        ),
        Artikel(
            id_penulis=user_ids[0],
            judul_artikel="Update: Program Daur Ulang Plastik Kota Bandung 2026",
            slug="update-program-daur-ulang-plastik-bandung-2026",
            kategori_id=ka_ids[1],  # Berita
            konten_teks=(
                "<p>Pemerintah Kota Bandung resmi meluncurkan program daur ulang plastik skala kota "
                "yang akan dimulai pada kuartal pertama 2026.</p>"
                "<p>Program ini menargetkan pengurangan sampah plastik sebesar 50% dalam 3 tahun ke depan.</p>"
            ),
            foto_cover_url="https://placehold.co/800x400?text=Program+Daur+Ulang+Bandung",
            status_publikasi=StatusPublikasi.PUBLISHED,
            jumlah_views=210,
            waktu_publish=now - timedelta(days=1),
        ),
        Artikel(
            id_penulis=user_ids[0],
            judul_artikel="Draft: Panduan Daur Ulang Lanjutan untuk Komunitas",
            slug="draft-panduan-daur-ulang-lanjutan",
            kategori_id=ka_ids[0],  # Edukasi
            konten_teks="<p>Ini masih draft panduan daur ulang lanjutan. Dalam pengerjaan.</p>",
            status_publikasi=StatusPublikasi.DRAFT,
        ),
    ]

    for item in artikel_list:
        db.session.add(item)
    db.session.commit()
    print(f"  ✅ {len(artikel_list)} artikel dibuat")

    # ── Likes ──
    likes = [
        ArtikelLike(id_artikel=artikel_list[0].id, id_user=user_ids[1]),
        ArtikelLike(id_artikel=artikel_list[0].id, id_user=user_ids[2]),
        ArtikelLike(id_artikel=artikel_list[0].id, id_user=user_ids[3]),
        ArtikelLike(id_artikel=artikel_list[1].id, id_user=user_ids[3]),
        ArtikelLike(id_artikel=artikel_list[1].id, id_user=user_ids[4]),
        ArtikelLike(id_artikel=artikel_list[1].id, id_user=user_ids[5]),
        ArtikelLike(id_artikel=artikel_list[1].id, id_user=user_ids[2]),
        ArtikelLike(id_artikel=artikel_list[2].id, id_user=user_ids[0]),
        ArtikelLike(id_artikel=artikel_list[2].id, id_user=user_ids[4]),
        ArtikelLike(id_artikel=artikel_list[3].id, id_user=user_ids[1]),
        ArtikelLike(id_artikel=artikel_list[3].id, id_user=user_ids[5]),
    ]
    for like in likes:
        db.session.add(like)
    db.session.commit()
    print(f"  ✅ {len(likes)} artikel likes dibuat")

    # ── Komentar ──
    # Komentar 1 - artikel 0
    k1 = ArtikelKomentar(
        id_artikel=artikel_list[0].id,
        id_user=user_ids[2],
        isi_komentar="Wah artikelnya sangat bermanfaat sekali, terima kasih sudah berbagi ilmu!",
        status_komentar=StatusKomentar.AKTIF,
    )
    db.session.add(k1)
    db.session.commit()

    # Reply dari admin ke k1
    k2 = ArtikelKomentar(
        id_artikel=artikel_list[0].id,
        id_user=user_ids[0],
        parent_id=k1.id,
        isi_komentar="Terima kasih kembali! Semoga bisa dipraktikkan di rumah ya 😊",
        status_komentar=StatusKomentar.AKTIF,
    )
    db.session.add(k2)

    # Reply lain ke k1
    k3 = ArtikelKomentar(
        id_artikel=artikel_list[0].id,
        id_user=user_ids[3],
        parent_id=k1.id,
        isi_komentar="Setuju! Saya juga sudah coba dan berhasil. Mudah kok.",
        status_komentar=StatusKomentar.AKTIF,
    )
    db.session.add(k3)

    # Komentar 2 - artikel 1
    k4 = ArtikelKomentar(
        id_artikel=artikel_list[1].id,
        id_user=user_ids[4],
        isi_komentar="Jam berapa kumpulnya nih? Saya dan teman mau ikut!",
        status_komentar=StatusKomentar.AKTIF,
    )
    db.session.add(k4)

    k5 = ArtikelKomentar(
        id_artikel=artikel_list[1].id,
        id_user=user_ids[0],
        parent_id=k4.id,
        isi_komentar="Kumpul jam 06.30 WIB di parkiran dekat Jembatan Citarum ya. Sampai jumpa!",
        status_komentar=StatusKomentar.AKTIF,
    )
    db.session.add(k5)

    # Komentar 3 - artikel 2
    k6 = ArtikelKomentar(
        id_artikel=artikel_list[2].id,
        id_user=user_ids[5],
        isi_komentar="Betul sekali! Di RT saya juga sudah ada bank sampah dan dampaknya nyata banget.",
        status_komentar=StatusKomentar.AKTIF,
    )
    db.session.add(k6)

    # Komentar 4 - artikel 3
    k7 = ArtikelKomentar(
        id_artikel=artikel_list[3].id,
        id_user=user_ids[2],
        isi_komentar="Semoga program ini bisa berhasil dan ditiru oleh kota-kota lain!",
        status_komentar=StatusKomentar.AKTIF,
    )
    db.session.add(k7)

    db.session.commit()
    print(f"  ✅ 7 komentar artikel dibuat (termasuk threaded replies)")


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
        laporan_ids = seed_laporan(user_ids, ref_ids)
        seed_marketplace(user_ids, ref_ids)
        if laporan_ids:
            seed_tindak_lanjut(user_ids, laporan_ids)
        seed_artikel(user_ids, ref_ids)

        print("\n" + "=" * 50)
        print("🎉 Seeding selesai!")
        print("=" * 50)


if __name__ == "__main__":
    run_seed()