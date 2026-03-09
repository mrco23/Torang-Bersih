"""
Referensi API tests.
"""
import pytest


class TestListReferensi:
    """Tests for listing referensi."""

    def test_list_referensi_success(self, client, ref_jenis_kolaborator):
        """Test listing jenis kolaborator."""
        response = client.get('/api/referensi/jenis-kolaborator')

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert isinstance(data['data'], list)

    def test_list_referensi_invalid_tipe(self, client):
        """Test listing with invalid tipe."""
        response = client.get('/api/referensi/invalid-tipe')

        assert response.status_code == 400


class TestCreateReferensi:
    """Tests for creating referensi (admin only)."""

    def test_create_success(self, client, admin_headers):
        """Test admin creating a new referensi."""
        response = client.post('/api/referensi/jenis-kolaborator',
            headers=admin_headers,
            json={'nama': 'Perusahaan Test'}
        )

        assert response.status_code == 201
        data = response.get_json()
        assert data['data']['nama'] == 'Perusahaan Test'

    def test_create_no_auth(self, client):
        """Test creating without auth."""
        response = client.post('/api/referensi/jenis-kolaborator',
            json={'nama': 'Test'}
        )

        assert response.status_code == 401

    def test_create_user_forbidden(self, client, auth_headers):
        """Test regular user cannot create."""
        response = client.post('/api/referensi/jenis-kolaborator',
            headers=auth_headers,
            json={'nama': 'Test'}
        )

        assert response.status_code == 403

    def test_create_duplicate(self, client, admin_headers, ref_jenis_kolaborator):
        """Test creating duplicate nama."""
        response = client.post('/api/referensi/jenis-kolaborator',
            headers=admin_headers,
            json={'nama': 'Komunitas'}
        )

        assert response.status_code == 409


class TestUpdateReferensi:
    """Tests for updating referensi."""

    def test_update_success(self, client, admin_headers, ref_jenis_kolaborator):
        """Test admin updating referensi."""
        response = client.put(
            f'/api/referensi/jenis-kolaborator/{ref_jenis_kolaborator.id}',
            headers=admin_headers,
            json={'nama': 'Komunitas Updated'}
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['data']['nama'] == 'Komunitas Updated'


class TestDeleteReferensi:
    """Tests for soft-deleting referensi."""

    def test_delete_success(self, client, admin_headers, ref_jenis_kolaborator):
        """Test admin soft-deleting referensi."""
        response = client.delete(
            f'/api/referensi/jenis-kolaborator/{ref_jenis_kolaborator.id}',
            headers=admin_headers
        )

        assert response.status_code == 200
