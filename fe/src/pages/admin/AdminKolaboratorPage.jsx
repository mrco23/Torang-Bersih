import { useState, useEffect } from "react";
import { kolaboratorAPI } from "../../services/api/routes/kolaborator.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";

function AdminKolaboratorPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jenisOptions, setJenisOptions] = useState([]);
  const [query, setQuery] = useState({
    page: 1,
    per_page: 10,
    search: "",
    jenis_kolaborator_id: "",
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
      const res = await kolaboratorAPI.getAll(params);
      setItems(res.data.data);
      setMeta(res.data.meta?.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data kolaborator");
    } finally {
      setLoading(false);
    }
  };
  const fetchJenis = async () => {
    try {
      const res = await referensiAPI.getAll("jenis-kolaborator");
      setJenisOptions(res.data.data || []);
    } catch {
      /* ignore */
    }
  };
  useEffect(() => {
    fetchJenis();
  }, []);
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.jenis_kolaborator_id, query.sort_order]);
  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
    fetchItems();
  };
  const handleDelete = async (id) => {
    if (!confirm("Hapus kolaborator ini?")) return;
    try {
      await kolaboratorAPI.delete(id);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus kolaborator");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Manajemen Kolaborator
      </h1>
      {/* Filter & Search */}
      <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari nama organisasi..."
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
            value={query.jenis_kolaborator_id}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                jenis_kolaborator_id: e.target.value,
                page: 1,
              }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Jenis</option>
            {jenisOptions.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama}
              </option>
            ))}
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
            Tidak ada kolaborator ditemukan
          </div>
        ) : (
          <>
            {/* Desktop: Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Organisasi
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Jenis
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Kota
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      PIC
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Kontak
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
                  {items.map((item) => (
                    <tr key={item.id} className="transition hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">
                          {item.nama_organisasi}
                        </p>
                        {item.email && (
                          <p className="text-xs text-gray-400">{item.email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {item.jenis_kolaborator?.nama}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.kabupaten_kota || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.penanggung_jawab || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.kontak || "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
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
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile: Card view */}
            <div className="divide-y divide-gray-100 md:hidden">
              {items.map((item) => (
                <div key={item.id} className="space-y-2 p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-800">
                        {item.nama_organisasi}
                      </p>
                      {item.email && (
                        <p className="text-xs text-gray-400">{item.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {item.jenis_kolaborator?.nama}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.kabupaten_kota}
                    </span>
                    <span className="text-xs text-gray-400">
                      PIC: {item.penanggung_jawab || "-"}
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
              ))}
            </div>
          </>
        )}
        {/* Pagination */}
        {meta && (
          <div className="flex flex-col items-center justify-between gap-2 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 sm:flex-row">
            <span>
              Menampilkan {items.length} dari {meta.total} kolaborator
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
export default AdminKolaboratorPage;
