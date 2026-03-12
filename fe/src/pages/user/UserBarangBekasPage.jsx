import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { marketplaceAPI } from "../../services/api/routes/marketplace.route";
import { KONDISI_LABELS, STATUS_LABELS, formatHarga } from "../../components/features/public/barangbekas/InputBarang/Constant";
import EditBarangBekasModal from "../../components/features/public/barangbekas/EditBarangBekasModal";

const STATUS_OPTIONS = [
  { value: "tersedia", label: "Tersedia" },
  { value: "dipesan", label: "Dipesan" },
  { value: "terjual", label: "Terjual" },
];

const UserBarangBekasPage = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [query, setQuery] = useState({
    page: 1,
    per_page: 10,
    search: "",
    status_ketersediaan: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(
        Object.entries(query).filter(([, v]) => v !== "")
      );
      const res = await marketplaceAPI.getMyMarketplace(params);
      setItems(res.data.data || []);
      setMeta(res.data.meta?.pagination || null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data barang");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await marketplaceAPI.updateKetersediaan(id, {
        status_ketersediaan: newStatus,
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status_ketersediaan: newStatus }
            : item
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus barang ini?")) return;
    setDeletingId(id);
    try {
      await marketplaceAPI.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (meta) setMeta((m) => ({ ...m, total: m.total - 1 }));
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus barang");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Barang Saya</h1>
        <Link
          to="/barang-bekas/jual"
          className="flex items-center gap-2 rounded-lg bg-(--primary) px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-(--primary-dark)"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Jual Barang
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari nama barang..."
            value={query.search}
            onChange={(e) => setQuery((q) => ({ ...q, search: e.target.value }))}
            className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-(--primary) md:px-4"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-(--primary) px-3 py-2 text-sm text-white transition hover:bg-(--primary-dark) md:px-4"
          >
            Cari
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          <select
            value={query.status_ketersediaan}
            onChange={(e) =>
              setQuery((q) => ({ ...q, status_ketersediaan: e.target.value, page: 1 }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-(--primary) md:px-3"
          >
            <option value="">Semua Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={query.sort_order}
            onChange={(e) =>
              setQuery((q) => ({ ...q, sort_order: e.target.value, page: 1 }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-(--primary) md:px-3"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {error && (
          <div className="bg-red-50 p-4 text-sm text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center p-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--primary) border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="font-semibold text-gray-700">Belum ada barang</p>
            <p className="mt-1 text-sm text-gray-400">Mulai jual barang bekasmu sekarang.</p>
            <Link
              to="/barang-bekas/jual"
              className="mt-4 rounded-lg bg-(--primary) px-5 py-2 text-sm font-bold text-white transition hover:bg-(--primary-dark)"
            >
              + Jual Barang
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Barang</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Kategori</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Harga</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Kondisi</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status Ketersediaan</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => {
                    const kondisi = KONDISI_LABELS[item.kondisi] || {};
                    const status = STATUS_LABELS[item.status_ketersediaan] || {};
                    return (
                      <tr key={item.id} className="group transition hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.foto_barang_urls?.[0] && (
                              <img
                                src={item.foto_barang_urls[0]}
                                alt={item.nama_barang}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{item.nama_barang}</p>
                              {item.berat_estimasi_kg && (
                                <p className="text-xs text-gray-400">~{item.berat_estimasi_kg} kg</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
                            {item.kategori_barang?.nama || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {formatHarga(item.harga)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${kondisi.bg} ${kondisi.color}`}
                          >
                            {kondisi.text || item.kondisi}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={item.status_ketersediaan}
                            disabled={updatingId === item.id}
                            onChange={(e) =>
                              handleUpdateStatus(item.id, e.target.value)
                            }
                            className={`rounded-full border px-2 py-1 text-xs font-medium transition ${status.bg} ${status.color} focus:outline-none focus:ring-1 focus:ring-(--primary) disabled:opacity-60`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              to={`/barang-bekas/${item.id}`}
                              className="text-xs font-medium text-blue-500 transition hover:text-blue-700"
                            >
                              Lihat
                            </Link>
                            <button
                              onClick={() => setEditingItem(item)}
                              className="text-xs font-medium text-orange-500 transition hover:text-orange-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                              className="text-xs font-medium text-red-500 transition hover:text-red-700 disabled:opacity-50"
                            >
                              {deletingId === item.id ? "Menghapus..." : "Hapus"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {items.map((item) => {
                const kondisi = KONDISI_LABELS[item.kondisi] || {};
                const status = STATUS_LABELS[item.status_ketersediaan] || {};
                return (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {item.foto_barang_urls?.[0] && (
                        <img
                          src={item.foto_barang_urls[0]}
                          alt={item.nama_barang}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-800">{item.nama_barang}</p>
                        <p className="mt-0.5 text-sm font-semibold text-(--primary)">
                          {formatHarga(item.harga)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${kondisi.bg} ${kondisi.color}`}>
                            {kondisi.text || item.kondisi}
                          </span>
                          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                            {item.kategori_barang?.nama}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      {/* Dropdown status */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Status:</span>
                        <select
                          value={item.status_ketersediaan}
                          disabled={updatingId === item.id}
                          onChange={(e) =>
                            handleUpdateStatus(item.id, e.target.value)
                          }
                          className={`rounded-full border px-2 py-1 text-xs font-medium ${status.bg} ${status.color} focus:outline-none disabled:opacity-60`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          to={`/barang-bekas/${item.id}`}
                          className="text-xs font-medium text-blue-500"
                        >
                          Lihat
                        </Link>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-xs font-medium text-orange-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-xs font-medium text-red-500 disabled:opacity-50"
                        >
                          {deletingId === item.id ? "..." : "Hapus"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {meta && (
          <div className="flex flex-col items-center justify-between gap-2 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 sm:flex-row">
            <span>
              Menampilkan {items.length} dari {meta.total} barang
            </span>
            <div className="flex gap-2">
              <button
                disabled={!meta.has_prev}
                onClick={() =>
                  setQuery((q) => ({ ...q, page: q.page - 1 }))
                }
                className="rounded-lg border px-3 py-1 transition hover:bg-gray-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="px-3 py-1">
                {meta.page} / {meta.total_pages}
              </span>
              <button
                disabled={!meta.has_next}
                onClick={() =>
                  setQuery((q) => ({ ...q, page: q.page + 1 }))
                }
                className="rounded-lg border px-3 py-1 transition hover:bg-gray-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {editingItem && (
        <EditBarangBekasModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            fetchItems();
          }}
        />
      )}
    </div>
  );
};

export default UserBarangBekasPage;
