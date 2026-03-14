/**
 * components/ArtikelToolbar.jsx
 * Baris toolbar: form pencarian, tombol sort, dan tombol muat ulang.
 *
 * Props dari useArtikelSaya:
 *   draft, setDraft, search, submitSearch, clearSearch
 *   sortBy, sortOrder, toggleSort
 *   loading, load
 */

import React from "react";
import {
  RiSearchLine,
  RiArrowUpDownLine,
  RiRefreshLine,
} from "react-icons/ri";

const SORT_OPTIONS = [
  { label: "Tanggal", field: "created_at"    },
  { label: "Judul",   field: "judul_artikel" },
];

export default function ArtikelToolbar({
  draft, setDraft, search, submitSearch, clearSearch,
  sortBy, sortOrder, toggleSort,
  loading, load,
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">

      {/* ── Search ── */}
      <form onSubmit={submitSearch} className="flex flex-1 items-center gap-2 sm:max-w-xs">
        <div className="relative flex-1">
          <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Cari judul artikel…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none placeholder:text-gray-400 focus:border-[#1e1f78] focus:ring-2 focus:ring-[#1e1f78]/10"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-[#1e1f78] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1a1b65]"
        >
          Cari
        </button>
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-500 hover:bg-gray-50"
          >
            Reset
          </button>
        )}
      </form>

      {/* ── Sort ── */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Urutkan:</span>
        {SORT_OPTIONS.map(({ label, field }) => {
          const active = sortBy === field;
          return (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                active
                  ? "border-[#1e1f78] bg-[#1e1f78]/5 text-[#1e1f78]"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              {label}
              <RiArrowUpDownLine
                className={`h-3 w-3 transition-transform ${
                  active && sortOrder === "asc" ? "rotate-180" : ""
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* ── Refresh ── */}
      <button
        onClick={load}
        disabled={loading}
        className="ml-auto flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
      >
        <RiRefreshLine className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        Muat Ulang
      </button>
    </div>
  );
}