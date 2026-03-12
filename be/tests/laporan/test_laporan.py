"""
Laporan Sampah Ilegal API tests.
"""
import pytest


class TestListLaporan:
    """Tests for listing laporan."""

    def test_list_success(self, client, test_laporan):
        """Test listing laporan (public)."""
        response = client.get('/api/laporan')

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'meta' in data

    def test_list_filter_status(self, client, test_laporan):
        """Test filtering laporan by status."""
        response = client.get('/api/laporan?status_laporan=menunggu')

        assert response.status_code == 200


class TestGetLaporan:
    """Tests for getting laporan detail."""

    def test_get_success(self, client, test_laporan):
        """Test getting laporan detail with tindak lanjut."""
        response = client.get(f'/api/laporan/{test_laporan.id}')

        assert response.status_code == 200
        data = response.get_json()
        assert 'tindak_lanjut' in data['data']

    def test_get_not_found(self, client):
        """Test getting non-existent laporan."""
        response = client.get('/api/laporan/non-existent-id')

        assert response.status_code == 404


class TestCreateLaporan:
    """Tests for creating laporan."""

    def test_create_success(self, client, auth_headers, ref_jenis_sampah):
        """Test user creating laporan."""
        response = client.post('/api/laporan',
            headers=auth_headers,
            json={
                'jenis_sampah_id': ref_jenis_sampah.id,
                'alamat_lokasi': 'Jl. Test Laporan',
                'latitude': -6.92,
                'longitude': 107.61,
                'estimasi_berat_kg': 10.0,
                'karakteristik': 'bisa_didaur_ulang',
                'bentuk_timbulan': 'tercecer',
            }
        )

        assert response.status_code == 201
        data = response.get_json()
        assert data['data']['alamat_lokasi'] == 'Jl. Test Laporan'

    def test_create_no_auth(self, client, ref_jenis_sampah):
        """Test creating without auth."""
        response = client.post('/api/laporan',
            json={'jenis_sampah_id': ref_jenis_sampah.id}
        )

        assert response.status_code == 401


class TestUpdateStatusLaporan:
    """Tests for updating laporan status."""

    def test_update_status_admin(self, client, admin_headers, test_laporan):
        """Test admin updating laporan status."""
        response = client.patch(
            f'/api/laporan/{test_laporan.id}/status',
            headers=admin_headers,
            json={'status_laporan': 'diterima'}
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['data']['status_laporan'] == 'diterima'

    def test_update_status_user_forbidden(self, client, auth_headers, test_laporan):
        """Test regular user cannot update status."""
        response = client.patch(
            f'/api/laporan/{test_laporan.id}/status',
            headers=auth_headers,
            json={'status_laporan': 'diterima'}
        )

        assert response.status_code == 403


class TestTindakLanjut:
    """Tests for tindak lanjut endpoints."""

    def test_create_tindak_lanjut(self, client, auth_headers, test_laporan_diterima):
        """Test creating tindak lanjut."""
        response = client.post(
            f'/api/laporan/{test_laporan_diterima.id}/tindak-lanjut',
            headers=auth_headers,
            json={
                'tindak_lanjut_penanganan': 'Pembersihan area',
                'tim_penindak': 'Tim RT 05',
            }
        )

        assert response.status_code == 201

    def test_list_tindak_lanjut(self, client, test_laporan_diterima):
        """Test listing tindak lanjut for a laporan."""
        response = client.get(f'/api/laporan/{test_laporan_diterima.id}/tindak-lanjut')

        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data['data'], list)


class TestDeleteLaporan:
    """Tests for deleting laporan."""

    def test_delete_as_owner(self, client, auth_headers, test_laporan):
        """Test owner deleting laporan."""
        response = client.delete(
            f'/api/laporan/{test_laporan.id}',
            headers=auth_headers
        )

        assert response.status_code == 200


class TestMyLaporan:
    """Tests for my-laporan endpoint."""

    def test_my_laporan_success(self, client, auth_headers, test_laporan):
        """Test user can get their own laporan list."""
        response = client.get('/api/laporan/my-laporan', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert len(data['data']) >= 1

    def test_my_laporan_filter_status(self, client, auth_headers, test_laporan):
        """Test filtering own laporan by status."""
        response = client.get('/api/laporan/my-laporan?status_laporan=menunggu', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True

    def test_my_laporan_no_auth(self, client):
        """Test my-laporan requires authentication."""
        response = client.get('/api/laporan/my-laporan')
        assert response.status_code == 401

    def test_my_laporan_pagination(self, client, auth_headers, test_laporan):
        """Test pagination on my-laporan."""
        response = client.get('/api/laporan/my-laporan?page=1&per_page=5', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert 'meta' in data
