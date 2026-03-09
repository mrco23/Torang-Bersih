import { useState, useEffect } from "react";
import { laporanAPI } from "../../services/api/routes/laporan.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";

const STATUS_LABELS = {
  menunggu: { text: "Menunggu", bg: "bg-yellow-50", color: "text-yellow-700" },
  diterima: { text: "Diterima", bg: "bg-blue-50", color: "text-blue-700" },
  ditindak: { text: "Ditindak", bg: "bg-indigo-50", color: "text-indigo-700" },
  selesai: { text: "Selesai", bg: "bg-green-50", color: "text-green-700" },
};
const STATUS_FLOW = ["menunggu", "diterima", "ditindak", "selesai"];
function AdminLaporanPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jenisOptions, setJenisOptions] = useState([]);
  const [query, setQuery] = useState({
    page: 1,
    per_page: 10,
    search: "",
    status_laporan: "",
    jenis_sampah_id: "",
    sort_by: "tanggal_lapor",
    sort_order: "desc",
  });
  // Detail & Tindak Lanjut modal
  const [detailItem, setDetailItem] = useState(null);
  const [tindakLanjutList, setTindakLanjutList] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [tlForm, setTlForm] = useState({
    tindak_lanjut_penanganan: "",
    tim_penindak: "",
    catatan: "",
  });
  const [tlLoading, setTlLoading] = useState(false);
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(query).filter(([_, v]) => v !== ""),
      );
      const res = await laporanAPI.getAll(params);
      setItems(res.data.data);
      setMeta(res.data.meta?.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  };
  const fetchJenis = async () => {
    try {
      const res = await referensiAPI.getAll("jenis-sampah");
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
    query.status_laporan,
    query.jenis_sampah_id,
    query.sort_order,
  ]);
  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
    fetchItems();
  };
  const handleStatusUpdate = async (id, newStatus) => {
    if (!confirm(`Ubah status menjadi "${STATUS_LABELS[newStatus]?.text}"?`))
      return;
    try {
      await laporanAPI.updateStatus(id, { status_laporan: newStatus });
      fetchItems();
      // refresh detail if open
      if (detailItem?.id === id) {
        openDetail(id);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengubah status");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Hapus laporan ini?")) return;
    try {
      await laporanAPI.delete(id);
      fetchItems();
      if (detailItem?.id === id) {
        setShowDetail(false);
        setDetailItem(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus laporan");
    }
  };
  const openDetail = async (id) => {
    try {
      const res = await laporanAPI.getById(id);
      setDetailItem(res.data.data);
      setTindakLanjutList(res.data.data.tindak_lanjut || []);
      setShowDetail(true);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memuat detail");
    }
  };
  const handleTlSubmit = async (e) => {
    e.preventDefault();
    if (!tlForm.tindak_lanjut_penanganan.trim()) return;
    setTlLoading(true);
    try {
      await laporanAPI.createTindakLanjut(detailItem.id, tlForm);
      setTlForm({
        tindak_lanjut_penanganan: "",
        tim_penindak: "",
        catatan: "",
      });
      openDetail(detailItem.id);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menambah tindak lanjut");
    } finally {
      setTlLoading(false);
    }
  };

  const getNextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx < STATUS_FLOW.length - 1) return STATUS_FLOW[idx + 1];
    return null;
  };
  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manajemen Laporan</h1>
      {/* Filter & Search */}
      <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari alamat lokasi..."
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
            value={query.status_laporan}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                status_laporan: e.target.value,
                page: 1,
              }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Status</option>
            {Object.entries(STATUS_LABELS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.text}
              </option>
            ))}
          </select>
          <select
            value={query.jenis_sampah_id}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                jenis_sampah_id: e.target.value,
                page: 1,
              }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Jenis Sampah</option>
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
            Tidak ada laporan ditemukan
          </div>
        ) : (
          <>
            {/* Desktop: Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Lokasi
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Jenis
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Berat
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => {
                    const st = STATUS_LABELS[item.status_laporan] || {};
                    const next = getNextStatus(item.status_laporan);
                    return (
                      <tr key={item.id} className="transition hover:bg-gray-50">
                        <td className="max-w-[200px] px-4 py-3">
                          <p className="truncate font-medium text-gray-800">
                            {item.alamat_lokasi || "-"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                            {item.jenis_sampah?.nama}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {item.estimasi_berat_kg
                            ? `${item.estimasi_berat_kg} kg`
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${st.bg} ${st.color}`}
                          >
                            {st.text || item.status_laporan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {item.tanggal_lapor
                            ? new Date(item.tanggal_lapor).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openDetail(item.id)}
                              className="text-xs text-(--primary) transition hover:text-(--primary-dark)"
                            >
                              Detail
                            </button>
                            {next && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(item.id, next)
                                }
                                className="text-xs text-blue-600 transition hover:text-blue-800"
                              >
                                → {STATUS_LABELS[next]?.text}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-xs text-red-500 transition hover:text-red-700"
                            >
                              Hapus
                            </button>
                          </div>
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
                const st = STATUS_LABELS[item.status_laporan] || {};
                const next = getNextStatus(item.status_laporan);
                return (
                  <div key={item.id} className="space-y-2 p-4">
                    <p className="font-medium text-gray-800">
                      {item.alamat_lokasi || "-"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        {item.jenis_sampah?.nama}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${st.bg} ${st.color}`}
                      >
                        {st.text}
                      </span>
                      {item.estimasi_berat_kg && (
                        <span className="text-xs text-gray-400">
                          {item.estimasi_berat_kg} kg
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => openDetail(item.id)}
                        className="text-xs font-medium text-(--primary)"
                      >
                        Detail
                      </button>
                      {next && (
                        <button
                          onClick={() => handleStatusUpdate(item.id, next)}
                          className="text-xs font-medium text-blue-600"
                        >
                          → {STATUS_LABELS[next]?.text}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs font-medium text-red-500"
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
              Menampilkan {items.length} dari {meta.total} laporan
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
      {/* Detail & Tindak Lanjut Modal */}
      {showDetail && detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Detail Laporan
              </h2>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-400 transition hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-5 p-6">
              {/* Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Lokasi</p>
                  <p className="font-medium text-gray-800">
                    {detailItem.alamat_lokasi || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Jenis Sampah</p>
                  <p className="font-medium text-gray-800">
                    {detailItem.jenis_sampah?.nama}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Estimasi Berat</p>
                  <p className="font-medium text-gray-800">
                    {detailItem.estimasi_berat_kg
                      ? `${detailItem.estimasi_berat_kg} kg`
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${STATUS_LABELS[detailItem.status_laporan]?.bg} ${STATUS_LABELS[detailItem.status_laporan]?.color}`}
                  >
                    {STATUS_LABELS[detailItem.status_laporan]?.text}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400">Karakteristik</p>
                  <p className="font-medium text-gray-800">
                    {detailItem.karakteristik || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Bentuk Timbulan</p>
                  <p className="font-medium text-gray-800">
                    {detailItem.bentuk_timbulan || "-"}
                  </p>
                </div>
              </div>
              {/* Foto Bukti */}
              {detailItem.foto_bukti_urls?.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-gray-400">Foto Bukti</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {detailItem.foto_bukti_urls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Bukti ${i + 1}`}
                        className="h-24 w-24 rounded-lg border object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* Status update buttons */}
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.map((s) => (
                  <button
                    key={s}
                    disabled={detailItem.status_laporan === s}
                    onClick={() => handleStatusUpdate(detailItem.id, s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      detailItem.status_laporan === s
                        ? "cursor-default bg-gray-100 text-gray-400"
                        : `${STATUS_LABELS[s].bg} ${STATUS_LABELS[s].color} cursor-pointer hover:opacity-80`
                    }`}
                  >
                    {STATUS_LABELS[s].text}
                  </button>
                ))}
              </div>
              {/* Tindak Lanjut List */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Riwayat Tindak Lanjut ({tindakLanjutList.length})
                </h3>
                {tindakLanjutList.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    Belum ada tindak lanjut
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tindakLanjutList.map((tl) => (
                      <div
                        key={tl.id}
                        className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm"
                      >
                        <p className="font-medium text-gray-800">
                          {tl.tindak_lanjut_penanganan}
                        </p>
                        {tl.tim_penindak && (
                          <p className="text-xs text-gray-500">
                            Tim: {tl.tim_penindak}
                          </p>
                        )}
                        {tl.catatan && (
                          <p className="mt-1 text-xs text-gray-500">
                            {tl.catatan}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                          {tl.waktu_tindak_lanjut
                            ? new Date(tl.waktu_tindak_lanjut).toLocaleString(
                                "id-ID",
                              )
                            : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Add Tindak Lanjut Form */}
              <form onSubmit={handleTlSubmit} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Tambah Tindak Lanjut
                </h3>
                <input
                  type="text"
                  placeholder="Penanganan yang dilakukan *"
                  value={tlForm.tindak_lanjut_penanganan}
                  onChange={(e) =>
                    setTlForm((f) => ({
                      ...f,
                      tindak_lanjut_penanganan: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Nama/Tim Penindak"
                  value={tlForm.tim_penindak}
                  onChange={(e) =>
                    setTlForm((f) => ({ ...f, tim_penindak: e.target.value }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none"
                />
                <textarea
                  placeholder="Catatan tambahan"
                  rows={2}
                  value={tlForm.catatan}
                  onChange={(e) =>
                    setTlForm((f) => ({ ...f, catatan: e.target.value }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={tlLoading}
                  className="cursor-pointer rounded-lg bg-(--primary) px-4 py-2 text-sm text-white transition hover:bg-(--primary-dark) disabled:opacity-50"
                >
                  {tlLoading ? "Menyimpan..." : "Tambah Tindak Lanjut"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminLaporanPage;
