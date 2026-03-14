

/**
 * components/ArtikelStates.jsx
 * State kosong dan skeleton loading untuk grid artikel.
 */

import React from "react";
import { RiArticleLine, RiAddLine } from "react-icons/ri";
import { Link } from "react-router-dom";
/* ── Skeleton loading grid ────────────────────────────────── */
export function ArtikelSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="h-44 animate-pulse bg-gray-100" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-gray-100" />
            <div className="h-3 w-full  animate-pulse rounded-full bg-gray-100" />
            <div className="h-3 w-2/3  animate-pulse rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────── */
export function ArtikelEmpty({ hasSearch, onReset, onWrite }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <RiArticleLine className="h-8 w-8 text-gray-300" />
      </div>

      <p className="text-base font-bold text-gray-700">
        {hasSearch ? "Tidak ada artikel yang cocok" : "Belum ada artikel"}
      </p>
      <p className="mt-1 text-sm text-gray-400">
        {hasSearch
          ? "Coba kata kunci lain."
          : "Mulai tulis artikel pertamamu sekarang!"}
      </p>

      {hasSearch ? (
        <button
          onClick={onReset}
          className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Reset Pencarian
        </button>
      ) : (
        <Link to="/artikel/buat"
          onClick={onWrite}
          className="mt-5 flex items-center gap-2 rounded-xl bg-[#1e1f78] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1a1b65]"
        >
          <RiAddLine className="h-4 w-4" /> Tulis Sekarang
        </Link>
      )}
    </div>
  );
}