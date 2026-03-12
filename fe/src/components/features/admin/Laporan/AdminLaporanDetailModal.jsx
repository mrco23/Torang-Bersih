import React from "react";
import { formatBeratLaporan } from "../../../../utils/helpers";

const AdminLaporanDetailModal = ({
  detailItem,
  setShowDetail,
  STATUS_LABELS,
  tindakLanjutList,
  tlForm,
  setTlForm,
  handleTlSubmit,
  tlLoading,
}) => {
  if (!detailItem) return null;

  const isCanTL =
    detailItem.status_laporan === "diterima" ||
    detailItem.status_laporan === "ditindak";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => setShowDetail(false)}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
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
                  ? formatBeratLaporan(detailItem.estimasi_berat_kg)
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

          {/* Tindak Lanjut List */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Riwayat Tindak Lanjut ({tindakLanjutList.length})
            </h3>
            {tindakLanjutList.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada tindak lanjut</p>
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
                      <p className="mt-1 rounded border border-gray-100 bg-white p-2 text-xs text-gray-500 italic">
                        "{tl.catatan}"
                      </p>
                    )}

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
                                  className="h-16 w-16 shrink-0 cursor-pointer rounded-lg object-cover ring-1 ring-gray-200 transition hover:opacity-80"
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
                                  className="h-16 w-16 shrink-0 cursor-pointer rounded-lg object-cover ring-1 ring-gray-200 transition hover:opacity-80"
                                  onClick={() => window.open(url, "_blank")}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    <p className="mt-2 text-[11px] font-medium text-gray-400">
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
          {isCanTL && (
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

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Foto Sebelum (Opsional)
                  </label>
                  <input
                    type="file"
                    id="tl_foto_sebelum"
                    className="block w-full cursor-pointer text-xs text-gray-500 file:mr-2 file:rounded file:border-0 file:bg-(--primary) file:px-2 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-(--primary-dark)"
                    onChange={(e) =>
                      setTlForm((f) => ({
                        ...f,
                        foto_sebelum: e.target.files[0],
                      }))
                    }
                  />
                  {tlForm.foto_sebelum && (
                    <p className="mt-1 truncate text-[10px] text-gray-500">
                      {tlForm.foto_sebelum.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Foto Setelah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="tl_foto_setelah"
                    required
                    className="block w-full cursor-pointer text-xs text-gray-500 file:mr-2 file:rounded file:border-0 file:bg-(--primary) file:px-2 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-(--primary-dark)"
                    onChange={(e) =>
                      setTlForm((f) => ({
                        ...f,
                        foto_setelah: e.target.files[0],
                      }))
                    }
                  />
                  {tlForm.foto_setelah && (
                    <p className="mt-1 truncate text-[10px] text-gray-500">
                      {tlForm.foto_setelah.name}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={tlLoading}
                className="cursor-pointer rounded-lg bg-(--primary) px-4 py-2 text-sm text-white transition hover:bg-(--primary-dark) disabled:opacity-50"
              >
                {tlLoading ? "Menyimpan..." : "Tambah Tindak Lanjut"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLaporanDetailModal;
