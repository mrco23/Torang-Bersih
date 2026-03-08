import React from 'react';

const AsetItem = ({ data }) => {
  const getKategoriStyle = (kategori) => {
    switch(kategori) {
      case 'Bank Sampah': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'TPST': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'TPA': return 'bg-orange-50 text-orange-700 ring-orange-600/20';
      case 'Composting': return 'bg-lime-50 text-lime-700 ring-lime-600/20';
      default: return 'bg-gray-50 text-gray-700 ring-gray-600/20';
    }
  };

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-3xl bg-white p-4 pr-6 ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:ring-gray-900/10 cursor-pointer">
      
      {/* Gambar Aset (Square modern dengan zoom effect) */}
      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-900/5">
        {data.foto_aset_urls && data.foto_aset_urls.length > 0 ? (
          <img 
            src={data.foto_aset_urls[0]} 
            alt={data.nama_aset} 
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="flex size-full items-center justify-center text-gray-300">
            <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
      </div>

      {/* Detail Utama */}
      <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
        
        {/* Info Nama & Lokasi */}
        <div className="flex flex-1 flex-col">
          <div className="mb-1.5 flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getKategoriStyle(data.kategori_aset)}`}>
              {data.kategori_aset}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-(--primary) line-clamp-1">
            {data.nama_aset}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-500 line-clamp-1">
            {data.alamat_lengkap}
          </p>
        </div>

        {/* Info Operasional / Status */}
        <div className="flex w-full sm:w-auto flex-row sm:flex-col items-center sm:items-end justify-between border-t border-gray-100 pt-4 sm:border-0 sm:pt-0 shrink-0 gap-1">
          <p className="text-sm font-bold text-gray-900">{data.nama_pic}</p>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              {data.status_aktif && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>}
              <span className={`relative inline-flex size-2.5 rounded-full ${data.status_aktif ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {data.status_aktif ? 'Beroperasi' : 'Tutup / Penuh'}
            </span>
          </div>
        </div>

      </div>

      {/* Hover Action Icon (Stripe Style) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100 hidden sm:block text-(--primary)">
        <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
      </div>

    </div>
  );
};

export default AsetItem;