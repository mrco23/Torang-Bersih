// components/features/admin/artikel/AdminArtikelTabelRow.jsx
import React from "react";
import { RiEyeLine, RiEditLine, RiDeleteBinLine } from "react-icons/ri";
import StatusBadge from "../../../ui/StatusBadge";
import {
  formatDate,
  formatTime,
  getAvatarUrl,
} from "../../../../utils/ArtikelHelpers";

const AdminArtikelTabelRow = ({ item, onView, onEdit, onDelete }) => {
  return (
    <tr className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50">
      {/* Organisasi/Artikel */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-500">
            {item.judul_artikel?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <p
              className="line-clamp-1 text-sm font-bold text-gray-900"
              style={{ color: "var(--dark-text)" }}
            >
              {item.judul_artikel}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {item.kategori?.nama || "Umum"}
            </p>
          </div>
        </div>
      </td>

      {/* Penulis */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={getAvatarUrl(item.penulis)}
            className="h-8 w-8 rounded-full object-cover"
            alt="avatar"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {item.penulis?.full_name || item.penulis?.username}
            </p>
            <p className="text-xs text-gray-500">
              {item.penulis?.email || "-"}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={item.status_publikasi} />
      </td>

      {/* Waktu */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <p className="font-medium">{formatDate(item.created_at)}</p>
          <span className="text-gray-400">•</span>
          <p className="text-xs text-gray-500">{formatTime(item.created_at)}</p>
        </div>
      </td>

      {/* Aksi */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <ActionButton
            icon={RiEyeLine}
            title="Detail"
            onClick={onView}
            variant="primary"
          />
          <ActionButton
            icon={RiEditLine}
            title="Edit"
            onClick={onEdit}
            variant="secondary"
          />
          <ActionButton
            icon={RiDeleteBinLine}
            title="Hapus"
            onClick={onDelete}
            variant="danger"
          />
        </div>
      </td>
    </tr>
  );
};

// Sub-component untuk action button
// eslint-disable-next-line no-unused-vars
const ActionButton = ({ icon: Icon, title, onClick, variant = "primary" }) => {
  const variants = {
    primary: {
      base: "bg-gray-100 text-gray-600 hover:bg-[#1e1f78] hover:text-white",
    },
    secondary: {
      base: "bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-700",
    },
    danger: {
      base: "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600",
    },
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${variants[variant].base}`}
      title={title}
    >
      <Icon size={14} />
      <span className="hidden sm:inline">{title}</span>
    </button>
  );
};

export default AdminArtikelTabelRow;
