"""
Kolaborator API tests.
"""
import pytest


class TestListKolaborator:
    """Tests for listing kolaborator."""

    def test_list_success(self, client, test_kolaborator):
        """Test listing kolaborator (public)."""
        response = client.get('/api/kolaborator')

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'meta' in data

    def test_list_with_search(self, client, test_kolaborator):
        """Test searching kolaborator."""
        response = client.get('/api/kolaborator?search=Test')

        assert response.status_code == 200


class TestGetKolaborator:
    """Tests for getting kolaborator detail."""

    def test_get_success(self, client, test_kolaborator):
        """Test getting kolaborator detail."""
        response = client.get(f'/api/kolaborator/{test_kolaborator.id}')

        assert response.status_code == 200
        data = response.get_json()
        assert data['data']['nama_organisasi'] == 'Test Kolaborator'

    def test_get_not_found(self, client):
        """Test getting non-existent kolaborator."""
        response = client.get('/api/kolaborator/non-existent-id')

        assert response.status_code == 404


class TestCreateKolaborator:
    """Tests for creating kolaborator."""

    def test_create_success(self, client, auth_headers, ref_jenis_kolaborator):
        """Test user creating kolaborator."""
        response = client.post('/api/kolaborator',
            headers=auth_headers,
            json={
                'nama_organisasi': 'Organisasi Baru',
                'jenis_kolaborator_id': ref_jenis_kolaborator.id,
                'deskripsi': 'A' * 500,
                'kabupaten_kota': 'Kota Bandung',
                'email': 'orgbaru@example.com',
            }
        )

        assert response.status_code == 201
        data = response.get_json()
        assert data['data']['nama_organisasi'] == 'Organisasi Baru'

    def test_create_no_auth(self, client, ref_jenis_kolaborator):
        """Test creating without auth."""
        response = client.post('/api/kolaborator',
            json={
                'nama_organisasi': 'No Auth Org',
                'jenis_kolaborator_id': ref_jenis_kolaborator.id,
            }
        )

        assert response.status_code == 401

    def test_create_invalid_ref(self, client, auth_headers):
        """Test creating with invalid jenis_kolaborator_id."""
        response = client.post('/api/kolaborator',
            headers=auth_headers,
            json={
                'nama_organisasi': 'Invalid Ref',
                'jenis_kolaborator_id': 'invalid-id',
            }
        )

        assert response.status_code == 404


class TestUpdateKolaborator:
    """Tests for updating kolaborator."""

    def test_update_as_owner(self, client, auth_headers, test_kolaborator):
        """Test owner updating kolaborator."""
        response = client.put(
            f'/api/kolaborator/{test_kolaborator.id}',
            headers=auth_headers,
            json={'nama_organisasi': 'Updated Org'}
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['data']['nama_organisasi'] == 'Updated Org'


class TestDeleteKolaborator:
    """Tests for deleting kolaborator."""

    def test_delete_as_owner(self, client, auth_headers, test_kolaborator):
        """Test owner deleting kolaborator."""
        response = client.delete(
            f'/api/kolaborator/{test_kolaborator.id}',
            headers=auth_headers
        )

        assert response.status_code == 200


class TestMyKolaborator:
    """Tests for my-kolaborator endpoint."""

    def test_my_kolaborator_success(self, client, auth_headers, test_kolaborator):
        """Test user can get their own kolaborator list."""
        response = client.get('/api/kolaborator/my-kolaborator', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert len(data['data']) >= 1
        # All items should belong to the authenticated user
        for item in data['data']:
            assert item['id_user'] is not None

    def test_my_kolaborator_with_search(self, client, auth_headers, test_kolaborator):
        """Test searching own kolaborator."""
        response = client.get('/api/kolaborator/my-kolaborator?search=Test', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True

    def test_my_kolaborator_no_auth(self, client):
        """Test my-kolaborator requires authentication."""
        response = client.get('/api/kolaborator/my-kolaborator')
        assert response.status_code == 401

    def test_my_kolaborator_pagination(self, client, auth_headers, test_kolaborator):
        """Test pagination on my-kolaborator."""
        response = client.get('/api/kolaborator/my-kolaborator?page=1&per_page=5', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert 'meta' in data
