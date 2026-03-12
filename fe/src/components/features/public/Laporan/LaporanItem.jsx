import React from "react";
import { Link } from "react-router-dom";
import { formatBeratLaporan } from "../../../../utils/helpers";

const LaporanItem = ({ data }) => {
  // Styling warna badge dinamis sesuai status laporan
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          ring: "ring-red-600/20",
          dot: "bg-red-500",
          ping: true,
        };
      case "selesai":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          ring: "ring-emerald-600/20",
          dot: "bg-emerald-500",
          ping: false,
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          ring: "ring-gray-600/20",
          dot: "bg-gray-500",
          ping: false,
        };
    }
  };

  const statusStyle = getStatusStyle(data.status_laporan);

  const formatTanggal = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper untuk waktu (Contoh: 08:30)
  const formatWaktu = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pelaporName = data.pelapor ? (data.pelapor.full_name || data.pelapor.username) : "Anonim";
  const namaJenisSampah = data.jenis_sampah ? data.jenis_sampah.nama : "Tidak diketahui";
  const bentukTimbulan = data.bentuk_timbulan === "tercecer" ? "Tercecer" : "Menumpuk";

  return (
    <Link
      to={`/laporan/${data.id}`}
      className="group relative flex cursor-pointer flex-col items-start gap-5 rounded-3xl bg-white p-4 pr-6 ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:ring-gray-900/10 sm:flex-row sm:items-center"
    >
      {/* Gambar Bukti Laporan */}
      <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-900/5">
        {data.foto_bukti_urls && data.foto_bukti_urls.length > 0 ? (
          <img
            src={data.foto_bukti_urls[0]}
            alt="Bukti Sampah"
            className={`size-full object-cover transition-transform duration-700 group-hover:scale-110 ${data.status_laporan?.toLowerCase() === "selesai" ? "grayscale-30" : ""}`}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-gray-300">
            <svg
              className="size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Konten Utama */}
      <div className="flex w-full flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Info Lokasi & Detail Sampah */}
        <div className="flex flex-1 flex-col">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase break-all">
              {data.id}
            </span>
            <span className="hidden size-1 rounded-full bg-gray-300 sm:block"></span>
            <span className="text-[11px] font-bold text-gray-500">
              Dilaporkan {formatTanggal(data.created_at)} -{" "}
              {formatWaktu(data.created_at)}
            </span>
          </div>
          <h3 className="line-clamp-1 text-base font-extrabold text-gray-900 transition-colors group-hover:text-[#1e1f78]">
            Timbulan Sampah {namaJenisSampah}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm font-medium text-gray-500">
            {data.alamat_lokasi}
          </p>

          {/* Info Teknis Singkat */}
          <div className="mt-3 flex items-center gap-3 text-xs font-medium text-gray-500">
            <span className="flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 ring-1 ring-gray-900/5">
              <svg
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
              ~ {formatBeratLaporan(data.estimasi_berat_kg)}
            </span>
            <span className="flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 ring-1 ring-gray-900/5">
              <svg
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              {bentukTimbulan}
            </span>
          </div>
        </div>

        {/* Info Status (Kanan) */}
        <div className="flex w-full shrink-0 flex-row items-center justify-between gap-2 border-t border-gray-100 pt-4 sm:w-auto sm:flex-col sm:items-end sm:border-0 sm:pt-0">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}
          >
            <span className="relative flex size-2">
              {statusStyle.ping && (
                <span
                  className={`absolute inline-flex size-full animate-ping rounded-full opacity-75 ${statusStyle.dot}`}
                ></span>
              )}
              <span
                className={`relative inline-flex size-2 rounded-full ${statusStyle.dot}`}
              ></span>
            </span>
            {(data.status_laporan || "").toUpperCase()}
          </span>
          <p className="hidden text-xs font-bold text-gray-400 sm:block">
            Pelapor: {pelaporName}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default LaporanItem;
