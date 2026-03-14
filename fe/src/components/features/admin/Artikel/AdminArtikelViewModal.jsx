import React from "react";
import { RiCloseLine, RiCalendarLine, RiUser3Line, RiExternalLinkLine } from "react-icons/ri";
import StatusBadge from "../../../ui/StatusBadge";
import { formatDate, formatTime } from "../../../../utils/ArtikelHelpers";

export default function AdminArtikelViewModal({ isOpen, onClose, item, loading = false }) {
  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-pulse">
           <div className="h-16 border-b bg-gray-50" />
           <div className="flex-1 p-8 space-y-6">
              <div className="h-10 w-3/4 bg-gray-200 rounded-lg" />
              <div className="aspect-video w-full bg-gray-100 rounded-2xl" />
              <div className="h-20 w-full bg-gray-50 rounded-xl" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Detail Artikel</h2>
            <StatusBadge status={item.status_publikasi} />
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="space-y-6">
            {/* Title & Cover */}
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                {item.judul_artikel}
              </h1>
              
              {item.foto_cover_url && (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 shadow-inner">
                  <img 
                    src={item.foto_cover_url} 
                    alt={item.judul_artikel}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <RiUser3Line className="text-[#1e1f78]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Penulis</p>
                  <p className="text-sm font-bold text-gray-900">{item.penulis?.full_name || item.penulis?.username}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <RiCalendarLine className="text-[#1e1f78]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Dibuat Pada</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatDate(item.created_at)} <span className="text-gray-400 font-normal">at</span> {formatTime(item.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="prose max-w-none">
              <div 
                className="text-gray-700 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: item.konten_teks }}
              />
            </div>

            {/* Tags if any */}
            {item.tags?.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tags Terkait</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <button 
            onClick={onClose}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800"
          >
            Tutup
          </button>
          <a 
            href={`/artikel/${item.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-[#1e1f78] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#1a1b65]"
          >
            <RiExternalLinkLine />
            Buka Halaman Publik
          </a>
        </div>

      </div>
    </div>
  );
}
