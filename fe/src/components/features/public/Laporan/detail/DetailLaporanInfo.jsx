import React from "react";
import { formatBeratLaporan } from "../../../../../utils/helpers";

const DetailLaporanInfo = ({
  laporan,
  pelaporName,
  pelapor,
  namaJenisSampah,
}) => {
  return (
    <div className="flex flex-col gap-10 pb-10">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-400 uppercase">
          {pelapor?.avatar_url ? (
            <img
              src={pelapor.avatar_url}
              alt={pelaporName}
              className="size-full rounded-full object-cover"
            />
          ) : (
            pelaporName.charAt(0)
          )}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{pelaporName}</p>
          <p className="text-sm text-gray-500">
            {pelapor?.role === "admin" ? "Admin" : "Pengguna"}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-extrabold text-gray-900">
          Informasi Detail
        </h2>
        <ul className="mb-6 grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <li className="flex flex-col border-b border-gray-100 py-3">
            <span className="mb-1 text-gray-500">Jenis Sampah</span>
            <span className="font-bold text-gray-900">{namaJenisSampah}</span>
          </li>
          <li className="flex flex-col border-b border-gray-100 py-3">
            <span className="mb-1 text-gray-500">Estimasi Berat</span>
            <span className="font-bold text-gray-900">
              {formatBeratLaporan(laporan.estimasi_berat_kg)}
            </span>
          </li>
          {laporan.karakteristik && (
            <li className="flex flex-col border-b border-gray-100 py-3">
              <span className="mb-1 text-gray-500">Karakteristik</span>
              <span className="font-bold text-gray-900 capitalize">
                {laporan.karakteristik.replace(/_/g, " ")}
              </span>
            </li>
          )}
          {laporan.bentuk_timbulan && (
            <li className="flex flex-col border-b border-gray-100 py-3">
              <span className="mb-1 text-gray-500">Bentuk Timbulan</span>
              <span className="font-bold text-gray-900 capitalize">
                {laporan.bentuk_timbulan}
              </span>
            </li>
          )}
        </ul>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-extrabold text-gray-900">
          Deskripsi Tambahan
        </h2>
        <p className="text-base leading-relaxed font-medium tracking-tight text-pretty whitespace-pre-line text-gray-600">
          {laporan.deskripsi_laporan || "- Tidak ada deskripsi tambahan -"}
        </p>
      </div>
    </div>
  );
};

export default DetailLaporanInfo;
