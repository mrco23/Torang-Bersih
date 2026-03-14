// components/features/admin/artikel/AdminArtikelTabel.jsx
import React from "react";
import AdminArtikelSearchBar from "./AdminArtikelSearchBar";
import AdminArtikelTabelRow from "./AdminArtikelTabelRow";
import AdminArtikelPagination from "./AdminArtikelPagnation";

const AdminArtikelTabel = ({
  articles,
  categories,
  loading,
  search,
  onSearchChange,
  filters,
  onFilterChange,
  page,
  meta,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <AdminArtikelSearchBar
        search={search}
        onSearchChange={onSearchChange}
        filters={filters}
        onFilterChange={onFilterChange}
        categories={categories}
      />

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <TableHeader label="Judul" />
                <TableHeader label="Penulis" />
                <TableHeader label="Status" />
                <TableHeader label="Waktu" />
                <TableHeader label="Aksi" align="right" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : articles.length === 0 ? (
                <EmptyRow />
              ) : (
                articles.map((item) => (
                  <AdminArtikelTabelRow
                    key={item.id}
                    item={item}
                    onView={() => onView(item)}
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <AdminArtikelPagination
          page={page}
          meta={meta}
          total={articles.length}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

// Sub-components
const TableHeader = ({ label, align }) => (
  <th
    className={`px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-500 uppercase ${align === "right" ? "text-right" : "text-left"}`}
  >
    {label}
  </th>
);

const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    <td colSpan="5" className="px-6 py-4">
      <div className="flex animate-pulse items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    </td>
  </tr>
);

const EmptyRow = () => (
  <tr>
    <td colSpan="5" className="px-6 py-16 text-center">
      <div className="flex flex-col items-center justify-center text-gray-400">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium">Tidak ada artikel ditemukan</p>
        <p className="mt-1 text-xs">
          Coba ubah filter atau kata kunci pencarian
        </p>
      </div>
    </td>
  </tr>
);

export default AdminArtikelTabel;
