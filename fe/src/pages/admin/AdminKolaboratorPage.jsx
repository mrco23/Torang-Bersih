import { useState, useEffect } from "react";
import { kolaboratorAPI } from "../../services/api/routes/kolaborator.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";
import toaster from "../../utils/toaster";
import StatusBadge from "../../components/shared/kolaborator/StatusBadge";
import KolaboratorDetailModal from "../../components/shared/kolaborator/KolaboratorDetailModal";

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
    status_verifikasi: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const [selectedKolaborator, setSelectedKolaborator] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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
  }, [
    query.page,
    query.jenis_kolaborator_id,
    query.status_verifikasi,
    query.sort_order,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus kolaborator ini?")) return;
    setActionLoading(true);
    try {
      await kolaboratorAPI.delete(id);
      toaster.success("Kolaborator berhasil dihapus");
      fetchItems();
      if (selectedKolaborator?.id === id) setSelectedKolaborator(null);
    } catch (err) {
      toaster.error(
        err.response?.data?.message || "Gagal menghapus kolaborator",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    let actionText = status === "terverifikasi" ? "menyetujui" : "menolak";
    if (!confirm(`Apakah Anda yakin ingin ${actionText} kolaborator ini?`))
      return;

    setActionLoading(true);
    try {
      await kolaboratorAPI.verify(id, { status_verifikasi: status });
      toaster.success(
        `Kolaborator berhasil di-${status === "terverifikasi" ? "verifikasi" : "tolak"}`,
      );
      fetchItems();
      if (selectedKolaborator?.id === id) {
        setSelectedKolaborator((prev) => ({
          ...prev,
          status_verifikasi: status,
        }));
      }
    } catch (err) {
      toaster.error(err.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="relative space-y-4 md:space-y-6">
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
            value={query.status_verifikasi}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                status_verifikasi: e.target.value,
                page: 1,
              }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Status</option>
            <option value="menunggu verifikasi">Menunggu Verifikasi</option>
            <option value="terverifikasi">Terverifikasi</option>
            <option value="ditolak">Ditolak</option>
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
                      Jenis & Wilayah
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Kontak PIC
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id} className="transition hover:bg-gray-50">
                      <td className="max-w-[200px] px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.logo_url ? (
                            <img
                              src={item.logo_url}
                              alt="Logo"
                              className="size-10 rounded-lg bg-gray-100 object-cover"
                            />
                          ) : (
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-500">
                              {item.nama_organisasi.charAt(0)}
                            </div>
                          )}
                          <div className="truncate">
                            <p
                              className="truncate font-medium text-gray-800"
                              title={item.nama_organisasi}
                            >
                              {item.nama_organisasi}
                            </p>
                            {item.email && (
                              <p
                                className="truncate text-xs text-gray-400"
                                title={item.email}
                              >
                                {item.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium whitespace-nowrap text-blue-700">
                          {item.jenis_kolaborator?.nama}
                        </span>
                        <p className="mt-1.5 text-xs text-gray-500">
                          {item.kabupaten_kota || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p className="text-xs font-medium text-gray-800">
                          {item.penanggung_jawab || "-"}
                        </p>
                        <p className="mt-0.5 text-xs">{item.kontak || "-"}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={item.status_verifikasi} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedKolaborator(item)}
                          className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
                        >
                          Detail
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
                <div key={item.id} className="space-y-3 p-4">
                  <div className="flex items-start gap-3">
                    {item.logo_url ? (
                      <img
                        src={item.logo_url}
                        alt="Logo"
                        className="size-10 shrink-0 rounded-lg bg-gray-100 object-cover"
                      />
                    ) : (
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-500">
                        {item.nama_organisasi.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-800">
                        {item.nama_organisasi}
                      </p>
                      {item.email && (
                        <p className="truncate text-[11px] text-gray-400">
                          {item.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700">
                      {item.jenis_kolaborator?.nama}
                    </span>
                    <StatusBadge status={item.status_verifikasi} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-2 text-[11px] text-gray-500">
                    <div>
                      <span className="mb-0.5 block text-gray-400">PIC</span>
                      <span className="font-medium text-gray-700">
                        {item.penanggung_jawab || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="mb-0.5 block text-gray-400">Kontak</span>
                      <span className="font-medium text-gray-700">
                        {item.kontak || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedKolaborator(item)}
                      className="flex-1 rounded-lg bg-gray-100 py-1.5 text-[11px] font-bold text-gray-700 transition hover:bg-gray-200"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {meta && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 sm:flex-row">
            <span>
              Menampilkan {items.length} dari {meta.total} kolaborator
            </span>
            <div className="flex gap-2">
              <button
                disabled={!meta.has_prev}
                onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
                className="rounded-lg border px-3 py-1.5 font-medium transition hover:bg-gray-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="flex items-center rounded-lg bg-gray-50 px-3 py-1.5 font-medium">
                Halaman {meta.page} / {meta.total_pages}
              </span>
              <button
                disabled={!meta.has_next}
                onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
                className="rounded-lg border px-3 py-1.5 font-medium transition hover:bg-gray-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedKolaborator && (
        <KolaboratorDetailModal
          data={selectedKolaborator}
          onClose={() => setSelectedKolaborator(null)}
          footerActions={
            <>
              <button
                onClick={() => handleDelete(selectedKolaborator.id)}
                disabled={actionLoading}
                className="flex w-full items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:text-red-700 disabled:opacity-50 sm:w-auto"
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Hapus Data
              </button>

              <div className="flex w-full gap-3 sm:w-auto">
                {selectedKolaborator.status_verifikasi === "menunggu" && (
                  <>
                    <button
                      onClick={() =>
                        handleVerify(selectedKolaborator.id, "ditolak")
                      }
                      disabled={actionLoading}
                      className="flex-1 rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50 sm:flex-none"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() =>
                        handleVerify(selectedKolaborator.id, "terverifikasi")
                      }
                      disabled={actionLoading}
                      className="flex-1 rounded-xl bg-(--primary) px-6 py-2.5 text-sm font-bold text-white transition hover:bg-(--primary-dark) disabled:opacity-50 sm:flex-none"
                    >
                      Verifikasi Data
                    </button>
                  </>
                )}
              </div>
            </>
          }
        />
      )}
    </div>
  );
}
export default AdminKolaboratorPage;
