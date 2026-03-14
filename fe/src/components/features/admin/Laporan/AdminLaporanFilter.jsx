import React from "react";
import { RiSettings4Line } from "react-icons/ri";

const AdminLaporanFilter = ({
  query,
  setQuery,
  handleSearch,
  STATUS_LABELS,
  jenisOptions,
  onManageRef,
}) => {
  return (
    <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Cari alamat lokasi..."
          value={query.search}
          onChange={(e) => setQuery((q) => ({ ...q, search: e.target.value }))}
          className="flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-4"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-(--primary) px-3 py-2 text-sm text-white transition hover:bg-(--primary-dark) md:px-4"
        >
          Cari
        </button>
      </form>
      <div className="flex flex-wrap gap-2 md:gap-3">
        <select
          value={query.status_laporan}
          onChange={(e) =>
            setQuery((q) => ({
              ...q,
              status_laporan: e.target.value,
              page: 1,
            }))
          }
          className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
        >
          <option value="">Semua Status</option>
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <option key={key} value={key}>
              {val.text}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1.5">
          <select
            value={query.jenis_sampah_id}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                jenis_sampah_id: e.target.value,
                page: 1,
              }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Jenis Sampah</option>
            {jenisOptions.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onManageRef}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:border-(--primary) hover:bg-(--primary-lightest) hover:text-(--primary)"
            title="Kelola Jenis Sampah"
          >
            <RiSettings4Line className="size-4" />
          </button>
        </div>
        <select
          value={query.sort_order}
          onChange={(e) =>
            setQuery((q) => ({ ...q, sort_order: e.target.value, page: 1 }))
          }
          className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
        >
          <option value="desc">Terbaru</option>
          <option value="asc">Terlama</option>
        </select>
      </div>
    </div>
  );
};

export default AdminLaporanFilter;
