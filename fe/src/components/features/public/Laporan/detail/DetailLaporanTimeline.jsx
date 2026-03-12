import React from "react";

const DetailLaporanTimeline = ({ tindakLanjutList, laporanStatus }) => {
  if (tindakLanjutList.length === 0) {
    const isSelesai = laporanStatus?.toLowerCase() === "selesai";
    return (
      <div className="flex flex-col text-pretty">
        <span
          className={`mb-1 text-xs font-bold tracking-widest uppercase ${
            laporanStatus?.toLowerCase() === "menunggu"
              ? "text-red-500"
              : "text-emerald-500"
          }`}
        >
          Status Saat Ini
        </span>
        <h4 className="text-base font-bold text-gray-900">
          {isSelesai ? "Penanganan Selesai" : "Menunggu Tindakan"}
        </h4>
        <p className="mt-1 text-sm text-gray-500">
          {isSelesai
            ? "Titik sampah telah berhasil dievakuasi."
            : "Laporan sedang disiarkan ke jaringan kolaborator dan Bank Sampah di sekitar Kota Manado."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {tindakLanjutList.map((tl, index) => (
        <div
          key={tl.id || index}
          className="flex flex-col border-b border-gray-100 pb-4 text-pretty last:border-0 last:pb-0"
        >
          <span className="mb-1 text-[11px] font-bold tracking-widest text-[#1e1f78] uppercase">
            {index === 0 ? "Tindakan Terbaru" : "Riwayat Tindakan"}
          </span>
          <div className="mb-2 flex items-center gap-2">
            {tl.penindak?.avatar_url ? (
              <img
                src={tl.penindak.avatar_url}
                alt="Avatar"
                className="h-6 w-6 rounded-full bg-gray-100 object-cover"
              />
            ) : (
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                {(tl.penindak?.full_name || tl.tim_penindak || "K").charAt(0)}
              </div>
            )}
            <h4 className="text-sm leading-tight font-bold text-gray-900">
              {tl.tim_penindak || tl.penindak?.full_name || "Kolaborator"}
            </h4>
          </div>

          <p className="text-sm font-medium text-gray-700">
            {tl.tindak_lanjut_penanganan}
          </p>
          {tl.catatan && (
            <p className="mt-1 rounded-lg border border-gray-100 bg-gray-50 p-2 text-xs text-gray-500 italic">
              "{tl.catatan}"
            </p>
          )}

          {/* FOTO SEBELUM & SESUDAH TINDAKAN */}
          <div className="mt-3 flex flex-row gap-6">
            {tl.foto_sebelum_tindakan_urls &&
              tl.foto_sebelum_tindakan_urls.length > 0 && (
                <div>
                  <span className="mb-1 block text-[11px] font-bold text-gray-500">
                    Sebelum:
                  </span>
                  <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                    {tl.foto_sebelum_tindakan_urls.map((url, i) => (
                      <img
                        key={`seb-${i}`}
                        src={url}
                        alt={`Foto Sebelum ${i + 1}`}
                        className="h-20 w-20 shrink-0 cursor-pointer rounded-xl object-cover ring-1 ring-gray-200 transition hover:opacity-80"
                        onClick={() => window.open(url, "_blank")}
                      />
                    ))}
                  </div>
                </div>
              )}

            {tl.foto_setelah_tindakan_urls &&
              tl.foto_setelah_tindakan_urls.length > 0 && (
                <div>
                  <span className="mb-1 block text-[11px] font-bold text-gray-500">
                    {tl.foto_sebelum_tindakan_urls?.length
                      ? "Sesudah:"
                      : "Bukti Tindakan:"}
                  </span>
                  <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                    {tl.foto_setelah_tindakan_urls.map((url, i) => (
                      <img
                        key={`set-${i}`}
                        src={url}
                        alt={`Foto Setelah ${i + 1}`}
                        className="h-20 w-20 shrink-0 cursor-pointer rounded-xl object-cover ring-1 ring-gray-200 transition hover:opacity-80"
                        onClick={() => window.open(url, "_blank")}
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>

          <span className="mt-2 text-[11px] font-medium text-gray-400">
            {tl.created_at
              ? new Date(tl.created_at).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : ""}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DetailLaporanTimeline;
