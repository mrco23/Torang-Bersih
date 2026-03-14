import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { laporanAPI } from "../../services/api/routes/laporan.route";
import toaster from "../../utils/toaster";

const STATUS_LABELS = {
  menunggu: { text: "Menunggu", bg: "bg-yellow-50", color: "text-yellow-700", ring: "ring-yellow-600/20" },
  diterima: { text: "Diterima", bg: "bg-blue-50", color: "text-blue-700", ring: "ring-blue-600/20" },
  ditindak: { text: "Ditindak", bg: "bg-indigo-50", color: "text-indigo-700", ring: "ring-indigo-600/20" },
  selesai: { text: "Selesai", bg: "bg-green-50", color: "text-green-700", ring: "ring-green-600/20" },
  ditolak: { text: "Ditolak", bg: "bg-red-50", color: "text-red-700", ring: "ring-red-600/20" },
};

function UserLaporanPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await laporanAPI.getMilikSaya();
      setItems(res.data.data.items || res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat riwayat laporan Anda");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus laporan ini?")) return;
    try {
      await laporanAPI.delete(id);
      toaster.success("Laporan berhasil dihapus");
      fetchItems();
    } catch (err) {
      toaster.error(err.response?.data?.message || "Gagal menghapus laporan");
    }
  };

  const Button = () => {
    return (
      <button
        onClick={() => navigate("/laporan/buat")}
        className="flex shrink-0 items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-(--primary-dark) active:scale-95"
      >
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Buat Laporan
      </button>
    )
  }

  // ── Empty State ──────────────────────────────────────────────────
  if (!loading && !error && items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-28 items-center justify-center rounded-full bg-linear-to-br from-indigo-50 to-blue-100">
          <svg className="size-14 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">Belum Ada Laporan</h2>
        <p className="mb-8 max-w-sm text-sm text-gray-500">
          Anda belum pernah melaporkan tumpukan sampah ilegal. Mari bantu bersihkan lingkungan!
        </p>
        <Button />
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Laporan Saya</h1>
          <p className="mt-1 text-sm text-gray-500">
            Daftar laporan tumpukan sampah ilegal yang telah Anda ajukan.
          </p>
        </div>
        <Button />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-10 animate-spin rounded-full border-4 border-gray-900 border-t-transparent" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {items.map((item) => {
            const st = STATUS_LABELS[item.status_laporan?.toLowerCase()] || { text: item.status_laporan, bg: "bg-gray-50", color: "text-gray-700", ring: "ring-gray-600/20" };
            return (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg sm:flex-row"
              >
                {/* Image Container */}
                <div className="relative h-48 shrink-0 overflow-hidden bg-gray-100 sm:w-56">
                  {item.foto_bukti_urls && item.foto_bukti_urls.length > 0 ? (
                    <img
                      src={item.foto_bukti_urls[0]}
                      alt="Bukti Laporan"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gray-50 text-gray-300">
                      <svg className="size-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${st.bg} ${st.color} ${st.ring}`}>
                      {st.text}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="mb-1 text-lg font-extrabold text-gray-900 transition-colors group-hover:text-indigo-700">
                        {item.jenis_sampah?.nama || "Laporan Sampah"}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                        <svg className="size-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                        </svg>
                        <span className="truncate">
                          {item.alamat_lokasi || item.kabupaten_kota || "Lokasi tidak diketahui"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
                    {item.deskripsi_laporan || "Tidak ada rincian deskripsi mengenai laporan ini."}
                  </p>

                  {/* Footer Action */}
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        }) : "-"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50"
                      >
                        Hapus
                      </button>
                      <button
                        onClick={() => navigate(`/laporan/${item.id}`)}
                        className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-gray-800"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserLaporanPage;
