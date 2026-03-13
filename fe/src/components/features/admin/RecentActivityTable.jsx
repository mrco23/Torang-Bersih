import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../ui/StatusBadge";

const RecentActivityTable = ({ title, items, type }) => {
  const getHeaders = () => {
    switch (type) {
      case "artikel":
        return ["Judul", "Kategori", "Status", "Tanggal"];
      case "kolaborator":
        return ["Organisasi", "Jenis", "Status", "Tanggal"];
      case "laporan":
        return ["Jenis Sampah", "Lokasi", "Status", "Tanggal"];
      default:
        return [];
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <Link 
          to={`/admin/${type === 'artikel' ? 'artikel' : type === 'kolaborator' ? 'kolaborator' : 'laporan'}`}
          className="text-xs font-bold text-primary hover:underline"
        >
          Lihat Semua
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold">
              {getHeaders().map((header) => (
                <th key={header} className="px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.slice(0, 5).map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                {type === "artikel" && (
                  <>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.foto_cover_url && (
                          <img 
                            src={item.foto_cover_url} 
                            alt="" 
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <span className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.judul_artikel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.kategori?.nama || '-'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status_publikasi} />
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{formatDate(item.created_at)}</td>
                  </>
                )}
                {type === "kolaborator" && (
                  <>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.logo_url || "https://placehold.co/100x100?text=Logo"} 
                          alt="" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">{item.nama_organisasi}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.jenis_kolaborator?.nama || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        item.status_verifikasi === 'terverifikasi' ? 'bg-green-100 text-green-700' :
                        item.status_verifikasi === 'menunggu' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status_verifikasi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{formatDate(item.created_at)}</td>
                  </>
                )}
                {type === "laporan" && (
                  <>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.jenis_sampah?.nama || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 line-clamp-1">{item.kabupaten_kota}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        item.status_laporan === 'selesai' ? 'bg-green-100 text-green-700' :
                        item.status_laporan === 'menunggu' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status_laporan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{formatDate(item.created_at)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityTable;
