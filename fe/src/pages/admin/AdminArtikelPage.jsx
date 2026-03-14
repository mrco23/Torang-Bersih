// components/features/admin/artikel/AdminArtikelPage.jsx
import React, { useState, useEffect } from "react";
import { RiAddLine, RiDashboardLine } from "react-icons/ri";
import AdminArtikelStats from "../../components/features/admin/Artikel/AdminArtikelStats";
import AdminArtikelTable from "../../components/features/admin/Artikel/AdminArtikelTabel";
import AdminArtikelDeleteModal from "../../components/features/admin/Artikel/AdminArtikelDeleteModal";

import AdminArtikelViewModal from "../../components/features/admin/Artikel/AdminArtikelViewModal";
import ArtikelEditModal from "../../components/features/user/UserMyArtikelPage/ArtikelEditModal";
import { artikelAPI } from "../../services/api/routes/artikel.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";
import toaster from "../../utils/toaster";
import ReferensiModalManager from "../../components/ui/ReferensiModalManager";
import AdminArtikelSearchBar from "../../components/features/admin/Artikel/AdminArtikelSearchBar";

const AdminArtikelPage = () => {
  // --- States ---
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);

  // Modal states
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [viewModal, setViewModal] = useState({ show: false, item: null });
  const [editModal, setEditModal] = useState({ show: false, item: null });
  const [createModal, setCreateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [refModal, setRefModal] = useState({
    show: false,
    tipe: "",
    label: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [query, setQuery] = useState({
    page: 1,
    per_page: 10,
    search: searchQuery,
    kategori_id: "",
    status_publikasi: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Sync searchQuery to query state with debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchQuery, page: 1 }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // --- Fetch Data ---
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(query).filter(([_, v]) => v !== ""),
      );

      const res = await artikelAPI.getAll(params);
      setArticles(res.data.data || []);
      setMeta(res.data.meta || null);
    } catch (err) {
      console.error("Gagal memuat artikel admin", err.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchCategories = async () => {
    try {
      const res = await referensiAPI.getAll("kategori-artikel");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat kategori", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFilterChange = (key, value) => {
    let mapping = {
      jenis: "kategori_id",
      status: "status_publikasi",
      sort: "sort_mapping",
    };

    const apiKey = mapping[key] || key;

    if (key === "sort") {
      const sortMap = {
        terbaru: { sort_by: "created_at", sort_order: "desc" },
        terlama: { sort_by: "created_at", sort_order: "asc" },
        terpopuler: { sort_by: "jumlah_views", sort_order: "desc" },
      };
      const { sort_by, sort_order } = sortMap[value] || sortMap.terbaru;
      setQuery((prev) => ({
        ...prev,
        sort_by,
        sort_order,
        sort: value,
        page: 1,
      }));
    } else {
      setQuery((prev) => ({ ...prev, [apiKey]: value, [key]: value, page: 1 }));
    }
  };

  // --- Handlers ---
  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await artikelAPI.delete(deleteModal.id);
      setDeleteModal({ show: false, id: null });
      fetchArticles();
    } catch {
      alert("Gagal menghapus artikel.");
    }
  };

  const handleView = async (item) => {
    setLoadingModal(true);
    try {
      const res = await artikelAPI.getById(item.id);
      setViewModal({ show: true, item: res.data.data });
    } catch {
      toaster.error("Gagal mengambil detail artikel.");
    } finally {
      setLoadingModal(false);
    }
  };

  const handleEdit = async (item) => {
    setLoadingModal(true);
    try {
      const res = await artikelAPI.getById(item.id);
      setEditModal({ show: true, item: res.data.data });
    } catch {
      toaster.error("Gagal mengambil detail artikel.");
    } finally {
      setLoadingModal(false);
    }
  };

  const handleCreateNew = () => {
    setCreateModal(true);
  };

  const handleSaveUpdate = async (formData, file) => {
    if (!formData.kategori_id) return alert("Pilih kategori terlebih dahulu");
    setUpdating(true);
    try {
      const articleId = editModal.item?.id;
      if (!articleId) return false;

      await artikelAPI.update(articleId, formData, file);
      fetchArticles();
      return true;
    } catch (err) {
      console.error("Gagal update artikel:", err.response.data);
      toaster.error(err.response.data.message);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveCreate = async (formData, file) => {
    if (!formData.kategori_id) return alert("Pilih kategori terlebih dahulu");
    setUpdating(true);
    try {
      await artikelAPI.create(formData, file);
      fetchArticles();
      return { message: "Artikel berhasil ditambahkan" };
    } catch (err) {
      console.error("Gagal buat artikel:", err.response.data);
      toaster.error(err.response.data.message);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteModal({ show: true, id: item.id });
  };

  return (
    <div className="min-h-screen space-y-8">
      {/* ── HEADER ── */}
      <div className="">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Manajemen Artikel
            </h1>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold shadow-lg transition-all"
            style={{
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              boxShadow:
                "0 10px 40px -10px color-mix(in srgb, var(--primary) 20%, transparent)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary)")
            }
          >
            <RiAddLine size={20} />
            Buat Artikel Baru
          </button>
        </div>

        {/* <AdminArtikelStats meta={meta} articles={articles} /> */}
      </div>

      {/* Search and Filters */}
      <AdminArtikelSearchBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        filters={query}
        onFilterChange={handleFilterChange}
        categories={categories}
        onManageRef={() =>
          setRefModal({
            show: true,
            tipe: "kategori-artikel",
            label: "Kategori Artikel",
          })
        }
      />

      {/* ── TABLE ── */}
      <AdminArtikelTable
        articles={articles}
        categories={categories}
        loading={loading}
        page={query.page}
        meta={meta}
        onPageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* ── DELETE MODAL ── */}
      <AdminArtikelDeleteModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        onConfirm={handleDelete}
      />

      {/* ── VIEW MODAL ── */}
      <AdminArtikelViewModal
        isOpen={viewModal.show}
        onClose={() => setViewModal({ show: false, item: null })}
        item={viewModal.item}
        loading={loadingModal}
      />

      {/* ── EDIT MODAL ── */}
      <ArtikelEditModal
        isOpen={editModal.show}
        onClose={() => setEditModal({ show: false, item: null })}
        article={editModal.item}
        onSave={handleSaveUpdate}
        updating={updating || loadingModal}
      />

      {/* ── CREATE MODAL ── */}
      {/* Reuse edit modal but with different title and empty initial article */}
      <ArtikelEditModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        article={{}} // empty for creation
        onSave={handleSaveCreate}
        updating={updating}
      />

      {/* ── REFERENSI MODAL ── */}
      <ReferensiModalManager
        isOpen={refModal.show}
        onClose={() => {
          setRefModal({ ...refModal, show: false });
          fetchCategories(); // Refresh categories in dropdown
        }}
        tipe={refModal.tipe}
        label={refModal.label}
      />
    </div>
  );
};

export default AdminArtikelPage;
