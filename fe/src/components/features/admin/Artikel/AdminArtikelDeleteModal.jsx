// components/features/admin/artikel/AdminArtikelDeleteModal.jsx
import React from "react";
import { RiCloseLine, RiAlertLine } from "react-icons/ri";

const AdminArtikelDeleteModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-10000 flex h-full items-center justify-center p-4 backdrop-blur-sm"
        style={{
          backgroundColor: "color-mix(in srgb, var(--dark) 40%, transparent)",
        }}
        onClick={onClose}
      />
      <div
        className="animate-in zoom-in-95 fixed inset-x-4 top-1/2 z-10001 mx-auto max-w-sm -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
        style={{
          boxShadow:
            "0 25px 80px -30px color-mix(in srgb, var(--dark) 40%, transparent)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              backgroundColor: "color-mix(in srgb, #dc2626 10%, transparent)",
              color: "#dc2626",
            }}
          >
            <RiAlertLine size={24} />
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        <h3
          className="mt-4 text-lg font-bold"
          style={{ color: "var(--dark-text)" }}
        >
          Hapus {title || "Artikel"}?
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--gray-muted)" }}
        >
          Tindakan ini tidak bisa dibatalkan. Data akan dihapus secara permanen
          dari sistem.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all"
            style={{
              borderColor: "var(--gray-light)",
              color: "var(--gray)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--gray-shine)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold shadow-lg transition-all"
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              boxShadow:
                "0 10px 40px -10px color-mix(in srgb, #dc2626 20%, transparent)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#b91c1c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#dc2626")
            }
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminArtikelDeleteModal;
