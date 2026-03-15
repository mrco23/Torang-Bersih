import { useState, useEffect, useCallback } from "react";
import { marketplaceAPI } from "../../services/api/routes/marketplace.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";
import {
  KONDISI_LABELS,
  STATUS_LABELS,
  formatHarga,
} from "../../components/features/public/barangbekas/InputBarang/Constant";
import ReferensiModalManager from "../../components/ui/ReferensiModalManager";
import { RiSettings4Line } from "react-icons/ri";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "tersedia", label: "Tersedia" },
  { value: "dipesan", label: "Dipesan" },
  { value: "terjual", label: "Terjual" },
];

// ── Detail Modal ───────────────────────────────────────────────────
function DetailModal({ item, onClose, onStatusChange }) {
  const [activeImg, setActiveImg] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const fotos = item.foto_barang_urls || [];
  const kondisi = KONDISI_LABELS[item.kondisi] || {};

  const handleDelete = async () => {
    if (!confirm("Hapus barang ini secara permanen?")) return;
    setDeleting(true);
    try {
      await marketplaceAPI.delete(item.id);
      onStatusChange(item.id, "__deleted__");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus barang");
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-bold text-gray-800">Detail Barang</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Foto */}
            <div>
              {fotos.length > 0 ? (
                <>
                  <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={fotos[activeImg]}
                      alt={item.nama_barang}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {fotos.length > 1 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto">
                      {fotos.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImg(idx)}
                          className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-all ${activeImg === idx ? "ring-2 ring-(--primary) ring-offset-1" : "opacity-60 hover:opacity-100"}`}
                        >
                          <img
                            src={url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  Tidak ada foto
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                  {item.kategori_barang?.nama}
                </p>
                <h3 className="mt-1 text-lg font-bold text-gray-800">
                  {item.nama_barang}
                </h3>
                <p className="mt-1 text-xl font-black text-(--primary)">
                  {formatHarga(item.harga)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${kondisi.bg} ${kondisi.color}`}
                >
                  {kondisi.text || item.kondisi}
                </span>
                {item.berat_estimasi_kg && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    ~{item.berat_estimasi_kg} kg
                  </span>
                )}
              </div>

              {/* Penjual */}
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Penjual
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.penjual?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(item.penjual?.full_name || "User")}&background=1e1f78&color=fff`
                    }
                    alt={item.penjual?.full_name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {item.penjual?.full_name ||
                        item.penjual?.username ||
                        "Anonim"}
                    </p>
                    {item.penjual?.username && (
                      <p className="text-xs text-gray-400">
                        @{item.penjual.username}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Lokasi */}
              {item.kabupaten_kota && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">{item.kabupaten_kota}</p>
                    {item.alamat_lengkap && (
                      <p className="line-clamp-2 text-xs text-gray-400">
                        {item.alamat_lengkap}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Kontak */}
              {item.kontak && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 shrink-0 text-emerald-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  <span className="font-medium">{item.kontak}</span>
                </div>
              )}

              {/* Deskripsi */}
              {item.deskripsi_barang && (
                <div>
                  <p className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Deskripsi
                  </p>
                  <p className="line-clamp-4 text-sm leading-relaxed whitespace-pre-line text-gray-600">
                    {item.deskripsi_barang}
                  </p>
                </div>
              )}

              {/* Status change */}
              <div>
                <p className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Status Ketersediaan
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => {
                    const sl = STATUS_LABELS[s.value] || {};
                    if (item.status_ketersediaan === s.value) {
                      return (
                        <span
                          key={s.value}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${sl.bg} ${sl.color}`}
                        >
                          {s.label}
                        </span>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-5 py-3">
          <p className="text-xs text-gray-400">
            Dibuat:{" "}
            {new Date(item.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Menghapus..." : "Hapus Barang"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
function AdminBarangBekasPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refModal, setRefModal] = useState({
    show: false,
    tipe: "",
    label: "",
  });

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

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(
        Object.entries(query).filter(([, v]) => v !== ""),
      );
      const res = await marketplaceAPI.getAll(params);
      setItems(res.data.data || []);
      setMeta(res.data.meta?.pagination || null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data barang");
    } finally {
      setLoading(false);
    }
  }, [query]);

  const fetchKategori = useCallback(async () => {
    try {
      const res = await referensiAPI.getAll("kategori-barang");
      setKategoriOptions(res.data.data || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchKategori();
  }, [fetchKategori]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
  };

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "__deleted__") {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status_ketersediaan: newStatus } : item,
        ),
      );
      // Sync selectedItem state too
      setSelectedItem((prev) =>
        prev?.id === id ? { ...prev, status_ketersediaan: newStatus } : prev,
      );
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Manajemen Barang Bekas
      </h1>

      {/* Filter & Search */}
      <div className="space-y-3 rounded-xl ring ring-gray-300 bg-white p-3 shadow-sm md:p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari nama barang..."
            value={query.search}
            onChange={(e) =>
              setQuery((q) => ({ ...q, search: e.target.value }))
            }
            className="flex-1 rounded-lg ring ring-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-4"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-(--primary) px-3 py-2 text-sm text-white transition hover:bg-(--primary-dark) md:px-4"
          >
            Cari
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1.5">
            <select
              value={query.kategori_barang_id}
              onChange={(e) =>
                setQuery((q) => ({
                  ...q,
                  kategori_barang_id: e.target.value,
                  page: 1,
                }))
              }
              className="rounded-lg ring ring-gray-300 px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
            >
              <option value="">Semua Kategori</option>
              {kategoriOptions.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                setRefModal({
                  show: true,
                  tipe: "kategori-barang",
                  label: "Kategori Barang",
                })
              }
              className="cursor-pointer rounded-lg ring ring-gray-300 bg-white p-2 text-gray-500 hover:border-(--primary) hover:bg-(--primary-lightest) hover:text-(--primary)"
              title="Kelola Kategori Barang"
            >
              <RiSettings4Line className="size-4" />
            </button>
          </div>
          <select
            value={query.kondisi}
            onChange={(e) =>
              setQuery((q) => ({ ...q, kondisi: e.target.value, page: 1 }))
            }
            className="rounded-lg ring ring-gray-300 px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
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
            className="rounded-lg ring ring-gray-300 px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
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
            className="rounded-lg ring ring-gray-300 px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-xl ring ring-gray-300 bg-white shadow-sm">
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
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Barang
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Penjual
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
                      Kota
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
                          <div className="flex items-center gap-2">
                            {item.foto_barang_urls?.[0] && (
                              <img
                                src={item.foto_barang_urls[0]}
                                alt={item.nama_barang}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.nama_barang}
                              </p>
                              {item.berat_estimasi_kg && (
                                <p className="text-xs text-gray-400">
                                  ~{item.berat_estimasi_kg} kg
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.penjual?.full_name ||
                            item.penjual?.username ||
                            "-"}
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
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${status.bg} ${status.color}`}
                          >
                            {status.text || item.status_ketersediaan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {item.kabupaten_kota || "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="text-xs font-medium text-(--primary) transition hover:underline"
                          >
                            Detail
                          </button>
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
                const statusLabel =
                  STATUS_LABELS[item.status_ketersediaan] || {};
                return (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {item.foto_barang_urls?.[0] && (
                        <img
                          src={item.foto_barang_urls[0]}
                          alt={item.nama_barang}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-800">
                          {item.nama_barang}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.penjual?.full_name || item.penjual?.username}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-(--primary)">
                          {formatHarga(item.harga)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${kondisi.bg} ${kondisi.color}`}
                          >
                            {kondisi.text || item.kondisi}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusLabel.bg} ${statusLabel.color}`}
                          >
                            {statusLabel.text || item.status_ketersediaan}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-xs font-medium text-(--primary) hover:underline"
                      >
                        Lihat Detail →
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

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Referensi Modal */}
      <ReferensiModalManager
        isOpen={refModal.show}
        onClose={() => {
          setRefModal({ ...refModal, show: false });
          fetchKategori();
        }}
        tipe={refModal.tipe}
        label={refModal.label}
      />
    </div>
  );
}

export default AdminBarangBekasPage;
