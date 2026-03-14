/**
 * components/ArtikelDeleteModal.jsx
 * Modal konfirmasi sebelum menghapus artikel.
 *
 * Props:
 *   open     — boolean, tampilkan modal atau tidak
 *   deleting — boolean, sedang proses hapus
 *   onCancel — () => void
 *   onConfirm — () => void
 */

import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";

export default function ArtikelDeleteModal({ open, deleting, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

        <div className="mb-4 flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
            <RiDeleteBinLine className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Hapus artikel ini?</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Tindakan ini permanen dan tidak bisa dibatalkan.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? "Menghapus…" : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}