import React from "react";
import { useAuth } from "../../../../../contexts/AuthContext";

const DetailLaporanAction = ({
  laporan,
  pelapor,
  menyelesaikan,
  onActionClick,
  onSelesaikanLaporan,
  onGoToMap,
}) => {
  const { user } = useAuth();
  return (
    <div className="mt-8 space-y-3">
      {(laporan.status_laporan?.toLowerCase() === "diterima" ||
        laporan.status_laporan?.toLowerCase() === "ditindak") && (
        <button
          onClick={onActionClick}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-95"
        >
          Tindak Lanjuti Laporan
        </button>
      )}

      {laporan.status_laporan?.toLowerCase() === "ditindak" &&
        user?.id === pelapor?.id && (
          <button
            onClick={onSelesaikanLaporan}
            disabled={menyelesaikan}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {menyelesaikan ? "Memproses..." : "Selesaikan Laporan"}
          </button>
        )}

      {/* TOMBOL LIHAT LOKASI DI PETA (NAVIAGSI KE /PETA) */}
      <button
        onClick={onGoToMap}
        disabled={!laporan.latitude || !laporan.longitude}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-sm font-bold text-gray-700 ring-1 ring-gray-200 transition-all ring-inset hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Lihat Lokasi di Peta
      </button>
    </div>
  );
};

export default DetailLaporanAction;
