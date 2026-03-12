"""
Pytest fixtures and configuration.
"""
import pytest
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.config.environment import TestingConfig
from app.config.extensions import db
from app.database.models import (
    User, UserRole,
    RefJenisKolaborator, RefKategoriAset, RefJenisSampah,
    RefKategoriBarang, RefKategoriArtikel,
    Kolaborator, Aset, LaporanSampahIlegal, Karakteristik, BentukTimbulan,
    MarketplaceDaurUlang, KondisiBarang,
)
from app.utils.password import hash_password


@pytest.fixture(scope='session')
def app():
    """Create application for testing."""
    app = create_app(TestingConfig)

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture(scope='function')
def client(app):
    """Create test client."""
    return app.test_client()


@pytest.fixture(scope='function')
def db_session(app):
    """Create database session for testing."""
    with app.app_context():
        connection = db.engine.connect()
        transaction = connection.begin()

        # Start a savepoint
        nested = connection.begin_nested()

        yield db.session

        # Rollback transaction
        if nested.is_active:
            nested.rollback()
        transaction.rollback()
        connection.close()


@pytest.fixture
def test_user(app):
    """Create a test user."""
    with app.app_context():
        user = User(
            email="test@example.com",
            username="testuser",
            password_hash=hash_password("Test123!"),
            full_name="Test User",
            role=UserRole.USER,
            is_verified=True,
            is_active=True
        )
        db.session.add(user)
        db.session.commit()

        user_id = user.id

        yield user

        # Cleanup
        db.session.query(User).filter_by(id=user_id).delete()
        db.session.commit()


@pytest.fixture
def test_admin(app):
    """Create a test admin user."""
    with app.app_context():
        admin = User(
            email="admin@example.com",
            username="testadmin",
            password_hash=hash_password("Admin123!"),
            full_name="Test Admin",
            role=UserRole.ADMIN,
            is_verified=True,
            is_active=True
        )
        db.session.add(admin)
        db.session.commit()

        admin_id = admin.id

        yield admin

        # Cleanup
        db.session.query(User).filter_by(id=admin_id).delete()
        db.session.commit()


@pytest.fixture
def auth_headers(client, test_user):
    """Get authentication headers for test user."""
    with client.application.app_context():
        response = client.post('/api/auth/login', json={
            'email': 'test@example.com',
            'password': 'Test123!'
        })

        data = response.get_json()
        token = data['data']['access_token']

        return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def admin_headers(client, test_admin):
    """Get authentication headers for admin user."""
    with client.application.app_context():
        response = client.post('/api/auth/login', json={
            'email': 'admin@example.com',
            'password': 'Admin123!'
        })

        data = response.get_json()
        token = data['data']['access_token']

        return {'Authorization': f'Bearer {token}'}


# ============================================================
# REFERENCE TABLE FIXTURES
# ============================================================
@pytest.fixture
def ref_jenis_kolaborator(app):
    """Create a test jenis kolaborator reference."""
    with app.app_context():
        ref = RefJenisKolaborator(nama="Komunitas")
        db.session.add(ref)
        db.session.commit()
        ref_id = ref.id
        yield ref
        db.session.query(RefJenisKolaborator).filter_by(id=ref_id).delete()
        db.session.commit()


@pytest.fixture
def ref_kategori_aset(app):
    """Create a test kategori aset reference."""
    with app.app_context():
        ref = RefKategoriAset(nama="Bank Sampah")
        db.session.add(ref)
        db.session.commit()
        ref_id = ref.id
        yield ref
        db.session.query(RefKategoriAset).filter_by(id=ref_id).delete()
        db.session.commit()


@pytest.fixture
def ref_jenis_sampah(app):
    """Create a test jenis sampah reference."""
    with app.app_context():
        ref = RefJenisSampah(nama="Plastik")
        db.session.add(ref)
        db.session.commit()
        ref_id = ref.id
        yield ref
        db.session.query(RefJenisSampah).filter_by(id=ref_id).delete()
        db.session.commit()


@pytest.fixture
def ref_kategori_barang(app):
    """Create a test kategori barang reference."""
    with app.app_context():
        ref = RefKategoriBarang(nama="Plastik")
        db.session.add(ref)
        db.session.commit()
        ref_id = ref.id
        yield ref
        db.session.query(RefKategoriBarang).filter_by(id=ref_id).delete()
        db.session.commit()


# ============================================================
# ENTITY FIXTURES
# ============================================================
@pytest.fixture
def test_kolaborator(app, test_user, ref_jenis_kolaborator):
    """Create a test kolaborator owned by test_user."""
    with app.app_context():
        item = Kolaborator(
            id_user=test_user.id,
            nama_organisasi="Test Kolaborator",
            jenis_kolaborator_id=ref_jenis_kolaborator.id,
            deskripsi="A" * 500,
            kabupaten_kota="Kota Bandung",
            penanggung_jawab="PIC Test",
            kontak="+6281000000001",
        )
        db.session.add(item)
        db.session.commit()
        item_id = item.id
        yield item
        db.session.query(Kolaborator).filter_by(id=item_id).delete()
        db.session.commit()


@pytest.fixture
def test_aset(app, test_user, ref_kategori_aset):
    """Create a test aset owned by test_user."""
    with app.app_context():
        item = Aset(
            id_user=test_user.id,
            nama_aset="Test Bank Sampah",
            kategori_aset_id=ref_kategori_aset.id,
            kabupaten_kota="Kota Bandung",
            penanggung_jawab="PIC Test",
            kontak="+6281000000001",
        )
        db.session.add(item)
        db.session.commit()
        item_id = item.id
        yield item
        db.session.query(Aset).filter_by(id=item_id).delete()
        db.session.commit()


@pytest.fixture
def test_laporan(app, test_user, ref_jenis_sampah):
    """Create a test laporan owned by test_user."""
    with app.app_context():
        item = LaporanSampahIlegal(
            id_warga=test_user.id,
            jenis_sampah_id=ref_jenis_sampah.id,
            alamat_lokasi="Jl. Test No. 1",
            latitude=-6.9200,
            longitude=107.6100,
            estimasi_berat_kg=25.0,
            karakteristik=Karakteristik.BISA_DIDAUR_ULANG,
            bentuk_timbulan=BentukTimbulan.MENUMPUK,
        )
        db.session.add(item)
        db.session.commit()
        item_id = item.id
        yield item
        db.session.query(LaporanSampahIlegal).filter_by(id=item_id).delete()
        db.session.commit()


@pytest.fixture
def test_laporan_diterima(app, test_user, test_admin, ref_jenis_sampah):
    """Create a test laporan with status 'diterima' (needed for tindak lanjut tests)."""
    from app.database.models import StatusLaporan
    from datetime import datetime, timezone
    with app.app_context():
        item = LaporanSampahIlegal(
            id_warga=test_user.id,
            jenis_sampah_id=ref_jenis_sampah.id,
            alamat_lokasi="Jl. Test Diterima No. 2",
            latitude=-6.9210,
            longitude=107.6110,
            estimasi_berat_kg=30.0,
            karakteristik=Karakteristik.RESIDU,
            bentuk_timbulan=BentukTimbulan.TERCECER,
            status_laporan=StatusLaporan.DITERIMA,
            id_admin_verifikator=test_admin.id,
            waktu_verifikasi=datetime.now(timezone.utc),
        )
        db.session.add(item)
        db.session.commit()
        item_id = item.id
        yield item
        db.session.query(LaporanSampahIlegal).filter_by(id=item_id).delete()
        db.session.commit()


@pytest.fixture
def test_marketplace_item(app, test_user, ref_kategori_barang):
    """Create a test marketplace item owned by test_user."""
    with app.app_context():
        item = MarketplaceDaurUlang(
            id_penjual=test_user.id,
            nama_barang="Botol Test",
            kategori_barang_id=ref_kategori_barang.id,
            deskripsi_barang="Botol bekas test",
            harga=10000,
            berat_estimasi_kg=3.0,
            kondisi=KondisiBarang.LAYAK_PAKAI,
        )
        db.session.add(item)
        db.session.commit()
        item_id = item.id
        yield item
        db.session.query(MarketplaceDaurUlang).filter_by(id=item_id).delete()
        db.session.commit()
