/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";

const StatusGroupCard = ({
  title,
  stats,
  icon: Icon,
  colorClass = "primary",
}) => {
  const statusColors = {
    // Artikel
    published: "bg-green-100 text-green-700",
    draft: "bg-orange-100 text-orange-700",
    archived: "bg-gray-100 text-gray-700",
    // Aset / Kolaborator
    terverifikasi: "bg-green-100 text-green-700",
    menunggu: "bg-yellow-100 text-yellow-700",
    ditolak: "bg-red-100 text-red-700",
    // Laporan
    diterima: "bg-blue-100 text-blue-700",
    ditindak: "bg-indigo-100 text-indigo-700",
    selesai: "bg-green-100 text-green-700",
    // Marketplace
    tersedia: "bg-green-100 text-green-700",
    dipesan: "bg-blue-100 text-blue-700",
    terjual: "bg-gray-100 text-gray-700",
  };

  const formatLabel = (label) => {
    return label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, " ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="rounded-lg p-2"
          style={{
            backgroundColor: `color-mix(in srgb, var(--${colorClass}) 10%, transparent)`,
            color: `var(--${colorClass})`,
          }}
        >
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>

      <div className="-mx-5 mt-4 -mb-5 space-y-0 divide-y divide-gray-100 border-t border-gray-50">
        {stats &&
          Object.entries(stats).map(([label, count]) => (
            <div
              key={label}
              className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-gray-50/50"
            >
              <span className="text-sm font-medium text-gray-600">
                {formatLabel(label)}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  statusColors[label] || "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </div>
          ))}
      </div>
    </motion.div>
  );
};

export default StatusGroupCard;
