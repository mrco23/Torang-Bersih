import { useState, useEffect } from "react";
import { laporanAPI } from "../../services/api/routes/laporan.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";

import AdminLaporanFilter from "../../components/features/admin/Laporan/AdminLaporanFilter";
import AdminLaporanTable from "../../components/features/admin/Laporan/AdminLaporanTable";
import AdminLaporanDetailModal from "../../components/features/admin/Laporan/AdminLaporanDetailModal";
import ReferensiModalManager from "../../components/ui/ReferensiModalManager";

const STATUS_LABELS = {
  menunggu: { text: "Menunggu", bg: "bg-yellow-50", color: "text-yellow-700" },
  diterima: { text: "Diterima", bg: "bg-blue-50", color: "text-blue-700" },
  ditindak: { text: "Ditindak", bg: "bg-indigo-50", color: "text-indigo-700" },
  selesai: { text: "Selesai", bg: "bg-green-50", color: "text-green-700" },
  ditolak: { text: "Ditolak", bg: "bg-red-50", color: "text-red-700" },
};
const STATUS_FLOW = ["menunggu", "diterima", "ditindak", "selesai"];

function AdminLaporanPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jenisOptions, setJenisOptions] = useState([]);
  const [refModal, setRefModal] = useState({ show: false, tipe: "", label: "" });
  const [query, setQuery] = useState({
    page: 1,
    per_page: 10,
    search: "",
    status_laporan: "",
    jenis_sampah_id: "",
    sort_by: "created_at",
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
    foto_sebelum: null,
    foto_setelah: null,
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
    let confirmMsg = `Ubah status menjadi "${STATUS_LABELS[newStatus]?.text}"?`;
    if (newStatus === "diterima")
      confirmMsg = "Terima laporan ini? Laporan akan dipublikasikan.";
    if (newStatus === "ditolak")
      confirmMsg = "Tolak laporan ini? Pelapor akan diberitahu.";

    if (!confirm(confirmMsg)) return;

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
    if (!tlForm.foto_setelah) {
      alert("Foto Setelah Tindakan wajib diunggah.");
      return;
    }

    setTlLoading(true);
    try {
      const payloadData = {
        tindak_lanjut_penanganan: tlForm.tindak_lanjut_penanganan,
        tim_penindak: tlForm.tim_penindak,
        catatan: tlForm.catatan,
      };

      const fotoFiles = {
        ...(tlForm.foto_sebelum && { foto_sebelum: [tlForm.foto_sebelum] }),
        foto_setelah: [tlForm.foto_setelah],
      };

      await laporanAPI.createTindakLanjut(
        detailItem.id,
        payloadData,
        fotoFiles,
      );
      setTlForm({
        tindak_lanjut_penanganan: "",
        tim_penindak: "",
        catatan: "",
        foto_sebelum: null,
        foto_setelah: null,
      });
      // Optionally re-fetch to see updates immediately
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
      <AdminLaporanFilter
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        STATUS_LABELS={STATUS_LABELS}
        jenisOptions={jenisOptions}
        onManageRef={() => setRefModal({ show: true, tipe: 'jenis-sampah', label: 'Jenis Sampah' })}
      />

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
          <AdminLaporanTable
            items={items}
            STATUS_LABELS={STATUS_LABELS}
            getNextStatus={getNextStatus}
            openDetail={openDetail}
            handleStatusUpdate={handleStatusUpdate}
            handleDelete={handleDelete}
          />
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
        <AdminLaporanDetailModal
          detailItem={detailItem}
          setShowDetail={setShowDetail}
          STATUS_LABELS={STATUS_LABELS}
          tindakLanjutList={tindakLanjutList}
          tlForm={tlForm}
          setTlForm={setTlForm}
          handleTlSubmit={handleTlSubmit}
          tlLoading={tlLoading}
        />
      )}
      {/* Referensi Modal */}
      <ReferensiModalManager
        isOpen={refModal.show}
        onClose={() => {
          setRefModal({ ...refModal, show: false });
          fetchJenis();
        }}
        tipe={refModal.tipe}
        label={refModal.label}
      />
    </div>
  );
}

export default AdminLaporanPage;
