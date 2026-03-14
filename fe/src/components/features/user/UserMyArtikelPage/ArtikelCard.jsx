/**
 * components/ArtikelCard.jsx
 * Menampilkan satu artikel dalam bentuk card.
 *
 * Props:
 *   art      — object artikel dari API
 *   onView   — () => void
 *   onDelete — () => void
 */

import React from "react";
import {
  RiEyeLine,
  RiDeleteBinLine,
  RiImageLine,
  RiTimeLine,
  RiHeartLine,
  RiChat1Line,
  RiCheckboxCircleLine,
  RiDraftLine,
} from "react-icons/ri";
import { fmtDate, stripHtml } from "../../../../utils/Artikel.Utils";

// Hapus button Edit dari action list
const ACTION_BTNS = [
  { icon: <RiEyeLine />,       label: "Lihat",  key: "view",   danger: false },
  { icon: <RiDeleteBinLine />, label: "Hapus",  key: "delete", danger: true  },
];

export default function ArtikelCard({ art, onView, onDelete }) {
  const isPublished = art.status_publikasi === "published";
  const handlers    = { view: onView, delete: onDelete };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

      {/* ── Cover ── */}
      <div
        className="relative h-44 cursor-pointer overflow-hidden bg-gray-100"
        onClick={onView}
      >
        {art.foto_cover_url ? (
          <img
            src={art.foto_cover_url}
            alt={art.judul_artikel}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <RiImageLine className="h-10 w-10 text-gray-300" />
          </div>
        )}

        {/* Badge status publikasi */}
        <div className="absolute left-3 top-3">
          {isPublished ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
              <RiCheckboxCircleLine className="h-3 w-3" /> Publik
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
              <RiDraftLine className="h-3 w-3" /> Draf
            </span>
          )}
        </div>

        {/* Badge kategori */}
        {art.kategori?.nama && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-[#1e1f78] shadow backdrop-blur-sm">
              {art.kategori.nama}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col p-4">

        {/* Judul */}
        <h3
          onClick={onView}
          className="mb-1.5 line-clamp-2 cursor-pointer text-sm font-bold leading-snug text-gray-900 hover:text-[#1e1f78]"
        >
          {art.judul_artikel}
        </h3>

        {/* Excerpt */}
        {art.excerpt && (
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-400">
            {stripHtml(art.excerpt)}
          </p>
        )}

        {/* Tags */}
        {art.tags?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {art.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#1e1f78]/15 bg-[#1e1f78]/5 px-2 py-0.5 text-[10px] font-medium text-[#1e1f78]"
              >
                #{t}
              </span>
            ))}
            {art.tags.length > 3 && (
              <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] text-gray-400">
                +{art.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-auto flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-0.5">
            <RiEyeLine   className="h-3.5 w-3.5" />{art.jumlah_views    ?? 0}
          </span>
          <span className="flex items-center gap-0.5">
            <RiHeartLine className="h-3.5 w-3.5" />{art.jumlah_likes    ?? 0}
          </span>
          <span className="flex items-center gap-0.5">
            <RiChat1Line className="h-3.5 w-3.5" />{art.jumlah_komentar ?? 0}
          </span>
          <span className="ml-auto flex items-center gap-0.5">
            <RiTimeLine className="h-3.5 w-3.5" />
            {fmtDate(art.waktu_publish || art.created_at)}
          </span>
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="flex items-center border-t border-gray-100 px-4 py-2.5">
        {ACTION_BTNS.map(({ icon, label, key, danger }) => (
          <button
            key={key}
            onClick={handlers[key]}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
              danger
                ? "text-red-400 hover:bg-red-50 hover:text-red-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-[#1e1f78]"
            }`}
          >
            <span className="h-3.5 w-3.5">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}