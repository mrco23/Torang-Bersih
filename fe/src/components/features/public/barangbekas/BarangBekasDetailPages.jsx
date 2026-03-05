import React, { useState } from "react";

const BarangBekasDetailPage = () => {
  const product = {
    id: 1,
    id_penjual: 101,
    nama_barang: "Botol Plastik PET Bersih (Siap Lebur)",
    kategori_barang: "Plastik",
    deskripsi_barang: "Kumpulan botol bekas air mineral 600ml. Sudah dicuci bersih, dibuang labelnya, dan dipress manual agar tidak makan tempat.\n\nSangat cocok untuk langsung disetor ke pabrik peleburan atau pengrajin daur ulang. Total ada sekitar 3 karung besar. Siap angkut kapan saja.",
    harga: 3500, 
    berat_estimasi_kg: 5.5,
    kondisi: "Rongsokan",
    foto_barang_urls: [
      "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=800&q=80"
    ],
    latitude: 1.4589,
    longitude: 124.8385,
    status_ketersediaan: "Tersedia", 
    penjual_nama: "Bank Sampah Melati",
    // Avatar disesuaikan dengan warna --primary (1e1f78)
    penjual_avatar: "https://ui-avatars.com/api/?name=Bank+Sampah+Melati&background=1e1f78&color=fff",
    penjual_bergabung: "Okt 2025",
    lokasi_cod: "Wanea, Manado"
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const formatHarga = (harga) => {
    if (harga === 0) return <span className="text-[var(--accent)]">Gratis (Donasi)</span>;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(harga);
  };

  const getKondisiColor = (kondisi) => {
    // Memanfaatkan --gray-shine dan --primary untuk kondisi Layak Pakai
    switch (kondisi) {
      case "Layak Pakai": return "bg-[var(--gray-shine)] text-[var(--primary)] ring-1 ring-[var(--primary)]/20";
      case "Butuh Perbaikan": return "bg-orange-50 text-orange-700 ring-1 ring-orange-200"; // Tetap semantic orange untuk peringatan
      case "Rongsokan": return "bg-gray-50 text-[var(--gray)] ring-1 ring-gray-200";
      default: return "bg-gray-50 text-[var(--gray)] ring-1 ring-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 selection:bg-[var(--gray-shine)] selection:text-[var(--primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="w-full aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden bg-[var(--gray-shine)] relative group">
              {product.status_ketersediaan === "Terjual" && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-[var(--dark)] text-white font-black px-6 py-3 rounded-xl tracking-widest transform -rotate-6 shadow-xl text-lg">
                    TERJUAL
                  </span>
                </div>
              )}
              <img 
                src={product.foto_barang_urls[activeImageIndex]} 
                alt={product.nama_barang} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Thumbnails */}
            {product.foto_barang_urls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
                {product.foto_barang_urls.map((url, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 ${
                      activeImageIndex === idx 
                      ? "ring-2 ring-[var(--primary)] ring-offset-2 opacity-100 shadow-md" 
                      : "ring-1 ring-gray-200 opacity-60 hover:opacity-100 hover:ring-[var(--gray-light)]"
                    }`}
                  >
                    <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
           )}
          </div>

         
          <div className="lg:col-span-4 flex flex-col pt-2">
            
            {/* Judul & Badge Kategori */}
            <div className="mb-6">
              <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-3 block">
                Kategori {product.kategori_barang}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--dark)] leading-tight tracking-tight">
                {product.nama_barang}
              </h1>
            </div>
            
            {/* Harga Utama */}
            <div className="mb-8">
              <p className="text-sm text-[var(--gray)] mb-1 font-medium">Harga Barang</p>
              <div className="text-4xl font-black text-[var(--primary)] flex items-baseline gap-2 tracking-tighter">
                {formatHarga(product.harga)}
              </div>
            </div>

            {/* Spesifikasi Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide ${getKondisiColor(product.kondisi)}`}>
                Kondisi: {product.kondisi}
              </span>
              <span className="bg-white text-[var(--dark-text)] ring-1 ring-gray-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <svg className="w-4 h-4 text-[var(--gray-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                Estimasi {product.berat_estimasi_kg} kg
              </span>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Deskripsi */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-[var(--dark)] mb-4 flex items-center gap-2">
                Deskripsi
              </h3>
              <p className="text-[var(--gray-muted)] leading-relaxed text-[15px] whitespace-pre-line">
                {product.deskripsi_barang}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="sticky top-32">
              
              <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                
                {/* Penjual */}
                <h3 className="text-xs font-bold text-[var(--gray-placeholder)] uppercase tracking-widest mb-4">Informasi Penjual</h3>
                <div className="flex items-center gap-4 mb-6">
                  <img src={product.penjual_avatar} alt={product.penjual_nama} className="w-14 h-14 rounded-full ring-2 ring-[var(--gray-shine)]" />
                  <div>
                    <div className="font-bold text-[var(--dark-text)] text-[15px]">{product.penjual_nama}</div>
                    <div className="text-xs text-[var(--gray)] mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-pulse"></span> Aktif
                    </div>
                  </div>
                </div>

                {/* Lokasi COD */}
                <div className="bg-[var(--gray-shine)] p-4 rounded-2xl mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-[var(--primary)]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[var(--gray-placeholder)] uppercase tracking-wider mb-1">Titik COD</p>
                      <p className="font-semibold text-[var(--dark-text)] text-sm leading-snug">{product.lokasi_cod}</p>
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                {product.status_ketersediaan === "Terjual" ? (
                  <button disabled className="w-full bg-gray-100 text-[var(--gray-placeholder)] py-4 rounded-2xl font-bold cursor-not-allowed">
                    Barang Sudah Terjual
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Tombol Primary menggunakan --primary */}
                    <button className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-4 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Pesan Barang
                    </button>
                    
                    {/* Tombol Secondary menggunakan --accent */}
                    <button className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white py-3.5 rounded-2xl font-bold transition-all shadow-md">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Chat Penjual
                    </button>
                  </div>
                )}
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BarangBekasDetailPage;