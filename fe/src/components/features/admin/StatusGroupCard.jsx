import React from "react";
import { motion } from "motion/react";

const StatusGroupCard = ({ title, stats, icon: Icon, colorClass = "primary" }) => {
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
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-2 rounded-lg"
          style={{ 
            backgroundColor: `color-mix(in srgb, var(--${colorClass}) 10%, transparent)`,
            color: `var(--${colorClass})`
          }}
        >
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>

      <div className="space-y-0 divide-y divide-gray-100 border-t border-gray-50 -mx-5 -mb-5 mt-4">
        {stats && Object.entries(stats).map(([label, count]) => (
          <div key={label} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
            <span className="text-sm font-medium text-gray-600">{formatLabel(label)}</span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
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
