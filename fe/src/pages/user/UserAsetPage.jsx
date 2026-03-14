import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { asetAPI } from "../../services/api/routes/aset.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";
import StatusBadge from "../../components/shared/kolaborator/StatusBadge";
import AsetDetailModal from "../../components/shared/aset/AsetDetailModal";
import AsetEditModal from "../../components/shared/aset/AsetEditModal";
import toaster from "../../utils/toaster";

function UserAsetPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [kategoriOptions, setKategoriOptions] = useState([]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await asetAPI.getMyAset();
      setItems(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data aset Anda");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (editing && kategoriOptions.length === 0) {
      referensiAPI
        .getAll("kategori-aset", { include_inactive: true })
        .then((res) => setKategoriOptions(res.data.data || []))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const handleDelete = async (id) => {
    if (!confirm("Hapus aset ini?")) return;
    try {
      await asetAPI.delete(id);
      toaster.success("Aset berhasil dihapus");
      fetchItems();
      if (selected?.id === id) setSelected(null);
      if (editing?.id === id) setEditing(null);
    } catch (err) {
      toaster.error(err.response?.data?.message || "Gagal menghapus aset");
    }
  };

  const openEdit = (item) => {
    setSelected(null);
    setEditing(item);
  };

  const handleEditSubmit = async (formData, filesPayload) => {
    setSubmitting(true);
    try {
      await asetAPI.update(editing.id, formData, filesPayload);
      toaster.success("Data aset berhasil diperbarui!");
      setEditing(null);
      fetchItems();
    } catch (err) {
      toaster.error(
        err.response?.data?.message || "Gagal memperbarui data aset",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Empty State ──────────────────────────────────────────────────
  if (!loading && !error && items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-28 items-center justify-center rounded-full bg-linear-to-br from-emerald-50 to-teal-100">
          <svg
            className="size-14 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          Belum Ada Aset Terdaftar
        </h2>
        <p className="mb-8 max-w-sm text-sm text-gray-500">
          Anda belum mendaftarkan fasilitas pengolahan sampah/aset apa pun.
          Daftarkan aset Anda sekarang!
        </p>
        <button
          onClick={() => navigate("/aset/daftar")}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-700 active:scale-95"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Daftarkan Aset Baru
        </button>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aset Saya</h1>
          <p className="mt-1 text-sm text-gray-500">
            Daftar fasilitas peduli lingkungan yang telah Anda daftarkan.
          </p>
        </div>
        <button
          onClick={() => navigate("/aset/daftar")}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-700 active:scale-95"
        >
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Daftar Baru
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg sm:flex-row"
            >
              {/* Image Container */}
              <div className="relative h-48 shrink-0 overflow-hidden bg-gray-100 sm:w-56">
                {item.pictures_urls && item.pictures_urls.length > 0 ? (
                  <img
                    src={item.pictures_urls[0]}
                    alt="Aset"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-3xl font-bold text-gray-300">
                    {item.nama_aset?.charAt(0)}
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="rounded-full border border-emerald-100 bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-700 uppercase shadow-sm backdrop-blur-sm">
                    {item.kategori_aset?.nama || "Aset"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h3
                      className="mb-1 text-xl font-extrabold text-gray-900 transition-colors group-hover:text-emerald-700"
                      title={item.nama_aset}
                    >
                      {item.nama_aset}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                      <svg
                        className="size-4 shrink-0 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"
                        />
                      </svg>
                      <span className="truncate">
                        {item.kabupaten_kota || "Lokasi belum diisi"}
                      </span>
                    </div>
                  </div>
                  <div className="self-start">
                    <StatusBadge status={item.status_verifikasi} />
                  </div>
                </div>

                <p className="mt-4 line-clamp-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
                  {item.deskripsi_aset ||
                    "Tidak ada rincian deskripsi mengenai aset fasilitas ini."}
                </p>

                {/* Footer Action */}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-sm font-bold text-emerald-700">
                      {item.penanggung_jawab?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        Penanggung Jawab
                      </p>
                      <p className="text-[13px] font-bold text-gray-800">
                        {item.penanggung_jawab || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-600 transition hover:bg-emerald-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() => setSelected(item)}
                      className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <AsetDetailModal data={selected} onClose={() => setSelected(null)} />
      )}

      {editing && (
        <AsetEditModal
          data={editing}
          kategoriOptions={kategoriOptions}
          onClose={() => setEditing(null)}
          onSubmit={handleEditSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
}

export default UserAsetPage;
