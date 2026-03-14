/**
 * components/ArtikelPagination.jsx
 * Navigasi halaman dengan ellipsis.
 *
 * Props:
 *   page, totalPages, goPage
 */

import React from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { buildPages } from "../../../../utils/Artikel.Utils";

export default function ArtikelPagination({ page, totalPages, goPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">

      {/* Prev */}
      <NavBtn disabled={page <= 1} onClick={() => goPage(page - 1)}>
        <RiArrowLeftSLine />
      </NavBtn>

      {/* Nomor halaman */}
      {buildPages(page, totalPages).map((n, i) =>
        n === "…" ? (
          <span key={`e${i}`} className="px-1 text-sm text-gray-400">…</span>
        ) : (
          <button
            key={n}
            onClick={() => goPage(n)}
            className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all ${
              n === page
                ? "bg-[#1e1f78] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:border-[#1e1f78] hover:text-[#1e1f78]"
            }`}
          >
            {n}
          </button>
        )
      )}

      {/* Next */}
      <NavBtn disabled={page >= totalPages} onClick={() => goPage(page + 1)}>
        <RiArrowRightSLine />
      </NavBtn>

      <span className="ml-1 text-xs text-gray-400">
        Hal. {page} / {totalPages}
      </span>
    </div>
  );
}

function NavBtn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-[#1e1f78] hover:text-[#1e1f78] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}