// components/features/admin/artikel/AdminArtikelPage.jsx
import React, { useState, useEffect } from "react";
import { RiAddLine, RiDashboardLine } from "react-icons/ri";
import AdminArtikelStats from "../../components/features/admin/Artikel/AdminArtikelStats";
import AdminArtikelTable from "../../components/features/admin/Artikel/AdminArtikelTabel";
import AdminArtikelDeleteModal from "../../components/features/admin/Artikel/AdminArtikelDeleteModal";
import { artikelAPI } from "../../services/api/routes/artikel.route";

const AdminArtikelPage = () => {
  // --- States ---
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [filters, setFilters] = useState({
    jenis: "",
    status: "",
    sort: "terbaru",
  });

  // --- Fetch Data ---
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const query = {
        page,
        per_page: 10,
        search,
        sort_by: filters.sort === "terpopuler" ? "jumlah_views" : "created_at",
        sort_order: filters.sort === "terlama" ? "asc" : "desc",
        status_publikasi: filters.status,
      };
      const params = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(query).filter(([_, v]) => v !== ""),
      );

      const res = await artikelAPI.getAll(params);
      setArticles(res.data.data || []);
      setMeta(res.data.meta || null);
    } catch (err) {
      console.error("Gagal memuat artikel admin", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, search, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
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

  const handleView = (item) => {
    window.open(`/artikel/${item.id}`, "_blank");
  };

  const handleEdit = (item) => {
    window.location.href = `/admin/artikel/edit/${item.id}`;
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

      {/* ── TABLE ── */}
      <AdminArtikelTable
        articles={articles}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        page={page}
        meta={meta}
        onPageChange={setPage}
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
    </div>
  );
};

export default AdminArtikelPage;
