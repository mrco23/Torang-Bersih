import { useState, useEffect } from "react";
import { marketplaceAPI } from "../../services/api/routes/marketplace.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";

const KONDISI_LABELS = {
  layak_pakai: {
    text: "Layak Pakai",
    bg: "bg-green-50",
    color: "text-green-700",
  },
  butuh_perbaikan: {
    text: "Butuh Perbaikan",
    bg: "bg-yellow-50",
    color: "text-yellow-700",
  },
  rongsokan: { text: "Rongsokan", bg: "bg-red-50", color: "text-red-700" },
};
const STATUS_LABELS = {
  tersedia: { text: "Tersedia", bg: "bg-green-50", color: "text-green-700" },
  dipesan: { text: "Dipesan", bg: "bg-blue-50", color: "text-blue-700" },
  terjual: { text: "Terjual", bg: "bg-gray-100", color: "text-gray-600" },
};
function AdminBarangBekasPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [query, setQuery] = useState({
    page: 1,
    per_page: 10,
    search: "",
    kategori_barang_id: "",
    kondisi: "",
    status_ketersediaan: "",
    sort_by: "created_at",
    sort_order: "desc",
  });
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(query).filter(([_, v]) => v !== ""),
      );
      const res = await marketplaceAPI.getAll(params);
      setItems(res.data.data);
      setMeta(res.data.meta?.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data barang");
    } finally {
      setLoading(false);
    }
  };
  const fetchKategori = async () => {
    try {
      const res = await referensiAPI.getAll("kategori-barang");
      setKategoriOptions(res.data.data || []);
    } catch {
      /* ignore */
    }
  };
  useEffect(() => {
    fetchKategori();
  }, []);
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.page,
    query.kategori_barang_id,
    query.kondisi,
    query.status_ketersediaan,
    query.sort_order,
  ]);
  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
    fetchItems();
  };
  const handleDelete = async (id) => {
    if (!confirm("Hapus barang ini?")) return;
    try {
      await marketplaceAPI.delete(id);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus barang");
    }
  };
  const formatHarga = (harga) => {
    if (!harga || harga === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  };
  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Manajemen Barang Bekas
      </h1>
      {/* Filter & Search */}
      <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari nama barang..."
            value={query.search}
            onChange={(e) =>
              setQuery((q) => ({ ...q, search: e.target.value }))
            }
            className="flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-4"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-(--primary) px-3 py-2 text-sm text-white transition hover:bg-(--primary-dark) md:px-4"
          >
            Cari
          </button>
        </form>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <select
            value={query.kategori_barang_id}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                kategori_barang_id: e.target.value,
                page: 1,
              }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Kategori</option>
            {kategoriOptions.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
          <select
            value={query.kondisi}
            onChange={(e) =>
              setQuery((q) => ({ ...q, kondisi: e.target.value, page: 1 }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Kondisi</option>
            <option value="layak_pakai">Layak Pakai</option>
            <option value="butuh_perbaikan">Butuh Perbaikan</option>
            <option value="rongsokan">Rongsokan</option>
          </select>
          <select
            value={query.status_ketersediaan}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                status_ketersediaan: e.target.value,
                page: 1,
              }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Status</option>
            <option value="tersedia">Tersedia</option>
            <option value="dipesan">Dipesan</option>
            <option value="terjual">Terjual</option>
          </select>
          <select
            value={query.sort_order}
            onChange={(e) =>
              setQuery((q) => ({ ...q, sort_order: e.target.value, page: 1 }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
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
          <div className="p-10 text-center text-sm text-gray-400">
            Tidak ada barang ditemukan
          </div>
        ) : (
          <>
            {/* Desktop: Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Barang
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Harga
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Kondisi
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Dibuat
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => {
                    const kondisi = KONDISI_LABELS[item.kondisi] || {};
                    const status =
                      STATUS_LABELS[item.status_ketersediaan] || {};
                    return (
                      <tr key={item.id} className="transition hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">
                            {item.nama_barang}
                          </p>
                          {item.berat_estimasi_kg && (
                            <p className="text-xs text-gray-400">
                              ~{item.berat_estimasi_kg} kg
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
                            {item.kategori_barang?.nama}
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
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${status.bg} ${status.color}`}
                          >
                            {status.text || item.status_ketersediaan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString(
                            "id-ID",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs text-red-500 transition hover:text-red-700"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Mobile: Card view */}
            <div className="divide-y divide-gray-100 md:hidden">
              {items.map((item) => {
                const kondisi = KONDISI_LABELS[item.kondisi] || {};
                const status = STATUS_LABELS[item.status_ketersediaan] || {};
                return (
                  <div key={item.id} className="space-y-2 p-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-800">
                          {item.nama_barang}
                        </p>
                        <p className="text-sm font-semibold text-(--primary)">
                          {formatHarga(item.harga)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
                        {item.kategori_barang?.nama}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${kondisi.bg} ${kondisi.color}`}
                      >
                        {kondisi.text || item.kondisi}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${status.bg} ${status.color}`}
                      >
                        {status.text || item.status_ketersediaan}
                      </span>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs font-medium text-red-500 transition hover:text-red-700"
                      >
                        Hapus
                      </button>
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
                onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
                className="rounded-lg border px-3 py-1 transition hover:bg-gray-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="px-3 py-1">
                {meta.page} / {meta.total_pages}
              </span>
              <button
                disabled={!meta.has_next}
                onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
                className="rounded-lg border px-3 py-1 transition hover:bg-gray-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminBarangBekasPage;
