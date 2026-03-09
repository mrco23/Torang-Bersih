"""
Marketplace Daur Ulang API tests.
"""
import pytest


class TestListMarketplace:
    """Tests for listing marketplace items."""

    def test_list_success(self, client, test_marketplace_item):
        """Test listing marketplace items (public)."""
        response = client.get('/api/marketplace')

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'meta' in data

    def test_list_with_filter(self, client, test_marketplace_item):
        """Test filtering marketplace by kondisi."""
        response = client.get('/api/marketplace?kondisi=layak_pakai')

        assert response.status_code == 200


class TestGetMarketplace:
    """Tests for getting marketplace item detail."""

    def test_get_success(self, client, test_marketplace_item):
        """Test getting marketplace item detail."""
        response = client.get(f'/api/marketplace/{test_marketplace_item.id}')

        assert response.status_code == 200
        data = response.get_json()
        assert data['data']['nama_barang'] == 'Botol Test'

    def test_get_not_found(self, client):
        """Test getting non-existent item."""
        response = client.get('/api/marketplace/non-existent-id')

        assert response.status_code == 404


class TestCreateMarketplace:
    """Tests for creating marketplace items."""

    def test_create_success(self, client, auth_headers, ref_kategori_barang):
        """Test user creating marketplace item."""
        response = client.post('/api/marketplace',
            headers=auth_headers,
            json={
                'nama_barang': 'Barang Test',
                'kategori_barang_id': ref_kategori_barang.id,
                'deskripsi_barang': 'Deskripsi test',
                'harga': 5000,
                'kondisi': 'layak_pakai',
            }
        )

        assert response.status_code == 201
        data = response.get_json()
        assert data['data']['nama_barang'] == 'Barang Test'

    def test_create_no_auth(self, client, ref_kategori_barang):
        """Test creating without auth."""
        response = client.post('/api/marketplace',
            json={
                'nama_barang': 'No Auth',
                'kategori_barang_id': ref_kategori_barang.id,
                'kondisi': 'layak_pakai',
            }
        )

        assert response.status_code == 401


class TestUpdateMarketplace:
    """Tests for updating marketplace items."""

    def test_update_as_owner(self, client, auth_headers, test_marketplace_item):
        """Test owner updating marketplace item."""
        response = client.put(
            f'/api/marketplace/{test_marketplace_item.id}',
            headers=auth_headers,
            json={'nama_barang': 'Botol Updated', 'harga': 20000}
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['data']['nama_barang'] == 'Botol Updated'


class TestDeleteMarketplace:
    """Tests for deleting marketplace items."""

    def test_delete_as_owner(self, client, auth_headers, test_marketplace_item):
        """Test owner deleting marketplace item."""
        response = client.delete(
            f'/api/marketplace/{test_marketplace_item.id}',
            headers=auth_headers
        )

        assert response.status_code == 200
