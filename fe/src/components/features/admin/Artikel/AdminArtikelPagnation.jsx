// components/features/admin/artikel/AdminArtikelPagnation.jsx
import React from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const AdminArtikelPagination = ({ page, meta, total, onPageChange }) => {
  const totalPages = meta?.pagination?.total_pages || 1;
  const totalItems = meta?.pagination?.total || 0;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
      <p className="text-sm text-gray-600">
        Menampilkan <span className="font-bold text-gray-900">{total}</span>{" "}
        dari <span className="font-bold text-gray-900">{totalItems}</span>{" "}
        kolaborator
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:border-gray-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RiArrowLeftSLine size={16} />
          Prev
        </button>

        <span className="px-4 py-2 text-sm font-semibold text-gray-700">
          Halaman {page} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:border-gray-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <RiArrowRightSLine size={16} />
        </button>
      </div>
    </div>
  );
};

export default AdminArtikelPagination;
