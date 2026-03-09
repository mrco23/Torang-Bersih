"""
Aset API tests.
"""
import pytest


class TestListAset:
    """Tests for listing aset."""

    def test_list_success(self, client, test_aset):
        """Test listing aset (public)."""
        response = client.get('/api/aset')

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'meta' in data

    def test_list_with_filter(self, client, test_aset):
        """Test filtering aset by status."""
        response = client.get('/api/aset?status_aktif=true')

        assert response.status_code == 200


class TestGetAset:
    """Tests for getting aset detail."""

    def test_get_success(self, client, test_aset):
        """Test getting aset detail."""
        response = client.get(f'/api/aset/{test_aset.id}')

        assert response.status_code == 200
        data = response.get_json()
        assert data['data']['nama_aset'] == 'Test Bank Sampah'

    def test_get_not_found(self, client):
        """Test getting non-existent aset."""
        response = client.get('/api/aset/non-existent-id')

        assert response.status_code == 404


class TestCreateAset:
    """Tests for creating aset."""

    def test_create_success(self, client, auth_headers, ref_kategori_aset):
        """Test user creating aset."""
        response = client.post('/api/aset',
            headers=auth_headers,
            json={
                'nama_aset': 'Aset Baru',
                'kategori_aset_id': ref_kategori_aset.id,
                'kabupaten_kota': 'Kota Test',
            }
        )

        assert response.status_code == 201
        data = response.get_json()
        assert data['data']['nama_aset'] == 'Aset Baru'

    def test_create_no_auth(self, client, ref_kategori_aset):
        """Test creating without auth."""
        response = client.post('/api/aset',
            json={
                'nama_aset': 'No Auth',
                'kategori_aset_id': ref_kategori_aset.id,
            }
        )

        assert response.status_code == 401


class TestUpdateAset:
    """Tests for updating aset."""

    def test_update_as_owner(self, client, auth_headers, test_aset):
        """Test owner updating aset."""
        response = client.put(
            f'/api/aset/{test_aset.id}',
            headers=auth_headers,
            json={'nama_aset': 'Updated Aset'}
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['data']['nama_aset'] == 'Updated Aset'


class TestDeleteAset:
    """Tests for deleting aset."""

    def test_delete_as_owner(self, client, auth_headers, test_aset):
        """Test owner deleting aset."""
        response = client.delete(
            f'/api/aset/{test_aset.id}',
            headers=auth_headers
        )

        assert response.status_code == 200
