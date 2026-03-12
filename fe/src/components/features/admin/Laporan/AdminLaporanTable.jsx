import React from "react";
import { formatBeratLaporan } from "../../../../utils/helpers";

const AdminLaporanTable = ({
  items,
  STATUS_LABELS,
  getNextStatus,
  openDetail,
  handleStatusUpdate,
  handleDelete,
}) => {
  return (
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
                      ? formatBeratLaporan(item.estimasi_berat_kg)
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
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
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
                      {item.status_laporan === "menunggu" ? (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(item.id, "diterima")
                            }
                            className="text-xs font-bold text-emerald-600 transition hover:text-emerald-700"
                          >
                            Terima
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(item.id, "ditolak")
                            }
                            className="text-xs font-bold text-red-500 transition hover:text-red-700"
                          >
                            Tolak
                          </button>
                        </>
                      ) : null}
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
                    {formatBeratLaporan(item.estimasi_berat_kg)}
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
                {item.status_laporan === "menunggu" ? (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(item.id, "diterima")}
                      className="text-xs font-bold text-emerald-600"
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(item.id, "ditolak")}
                      className="text-xs font-bold text-red-500"
                    >
                      Tolak
                    </button>
                  </>
                ) : next ? (
                  <button
                    onClick={() => handleStatusUpdate(item.id, next)}
                    className="text-xs font-medium text-blue-600"
                  >
                    → {STATUS_LABELS[next]?.text}
                  </button>
                ) : null}
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
  );
};

export default AdminLaporanTable;
