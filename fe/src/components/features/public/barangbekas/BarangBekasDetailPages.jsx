import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import untuk navigasi
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Marker Icon menggunakan warna --primary
const customMarkerIcon = new L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="relative flex items-center justify-center size-10">
      <div class="absolute size-full bg-[var(--primary)] rounded-full animate-ping opacity-40"></div>
      <div class="relative size-6 bg-[var(--primary)] border-2 border-white rounded-full shadow-md z-10"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const BarangBekasDetailPage = () => {
  const navigate = useNavigate();

  const product = {
    id: 1,
    id_penjual: 101,
    nama_barang: "Botol Plastik PET Bersih (Siap Lebur)",
    kategori_barang: "Plastik",
    deskripsi_barang:
      "Kumpulan botol bekas air mineral 600ml. Sudah dicuci bersih, dibuang labelnya, dan dipress manual agar tidak makan tempat.\n\nSangat cocok untuk langsung disetor ke pabrik peleburan atau pengrajin daur ulang. Total ada sekitar 3 karung besar. Siap angkut kapan saja.",
    harga: 3500,
    berat_estimasi_kg: 5.5,
    kondisi: "Rongsokan",
    foto_barang_urls: [
      "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=800&q=80",
    ],
    latitude: 1.4589,
    longitude: 124.8385,
    status_ketersediaan: "Tersedia",
    penjual_nama: "Bank Sampah Melati",
    penjual_avatar:
      "https://ui-avatars.com/api/?name=Bank+Sampah+Melati&background=1e1f78&color=fff",
    penjual_bergabung: "Okt 2025",
    lokasi_cod: "Wanea, Manado",
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fungsi untuk pindah ke halaman peta
  const handleGoToMap = () => {
    navigate("/peta", {
      state: {
        targetLocation: {
          lat: product.latitude,
          lng: product.longitude,
          name: product.nama_barang,
          type: "Barang Daur Ulang",
          status: product.status_ketersediaan,
        },
      },
    });
  };

  const formatHarga = (harga) => {
    if (harga === 0)
      return <span className="text-[var(--accent)]">Gratis (Donasi)</span>;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(harga);
  };

  const getKondisiColor = (kondisi) => {
    switch (kondisi) {
      case "Layak Pakai":
        return "bg-[var(--gray-shine)] text-[var(--primary)] ring-1 ring-[var(--primary)]/20";
      case "Butuh Perbaikan":
        return "bg-orange-50 text-orange-700 ring-1 ring-orange-200";
      case "Rongsokan":
        return "bg-gray-50 text-[var(--gray)] ring-1 ring-gray-200";
      default:
        return "bg-gray-50 text-[var(--gray)] ring-1 ring-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 selection:bg-[var(--gray-shine)] selection:text-[var(--primary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* KOLOM KIRI: GALERI FOTO */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[var(--gray-shine)] sm:aspect-square">
              {product.status_ketersediaan === "Terjual" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                  <span className="-rotate-6 transform rounded-xl bg-[var(--dark)] px-6 py-3 text-lg font-black tracking-widest text-white shadow-xl">
                    TERJUAL
                  </span>
                </div>
              )}
              <img
                src={product.foto_barang_urls[activeImageIndex]}
                alt={product.nama_barang}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {product.foto_barang_urls.length > 1 && (
              <div className="scrollbar-hide flex gap-4 overflow-x-auto px-1 py-2">
                {product.foto_barang_urls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl transition-all duration-300 ${activeImageIndex === idx ? "opacity-100 shadow-md ring-2 ring-[var(--primary)] ring-offset-2" : "opacity-60 ring-1 ring-gray-200 hover:opacity-100"}`}
                  >
                    <img
                      src={url}
                      alt={`Thumb ${idx}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* KOLOM TENGAH: INFO BARANG */}
          <div className="flex flex-col pt-2 lg:col-span-4">
            <div className="mb-6">
              <span className="mb-3 block text-xs font-bold tracking-widest text-[var(--accent)] uppercase">
                Kategori {product.kategori_barang}
              </span>
              <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-[var(--dark)] sm:text-4xl">
                {product.nama_barang}
              </h1>
            </div>

            <div className="mb-8">
              <p className="mb-1 text-sm font-medium text-[var(--gray)]">
                Harga Barang
              </p>
              <div className="flex items-baseline gap-2 text-4xl font-black tracking-tighter text-[var(--primary)]">
                {formatHarga(product.harga)}
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
              <span
                className={`rounded-xl px-4 py-2 text-xs font-bold tracking-wide uppercase ${getKondisiColor(product.kondisi)}`}
              >
                Kondisi: {product.kondisi}
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[var(--dark-text)] shadow-sm ring-1 ring-gray-200">
                Estimasi {product.berat_estimasi_kg} kg
              </span>
            </div>

            <hr className="mb-8 border-gray-100" />

            <div className="mb-10">
              <h3 className="mb-4 text-lg font-bold text-[var(--dark)]">
                Deskripsi
              </h3>
              <p className="text-[15px] leading-relaxed whitespace-pre-line text-[var(--gray-muted)]">
                {product.deskripsi_barang}
              </p>
            </div>

            {/* PETA MINI (PREVIEW) */}
            <div className="mb-10 border-t border-gray-100 pt-4">
              <h3 className="mb-4 text-lg font-bold text-balance text-[var(--dark)]">
                Lokasi Barang (Titik COD)
              </h3>
              <div className="relative z-0 h-64 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-inner">
                <MapContainer
                  center={[product.latitude, product.longitude]}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[product.latitude, product.longitude]}
                    icon={customMarkerIcon}
                  >
                    <Popup>
                      <b>{product.penjual_nama}</b>
                      <br />
                      {product.lokasi_cod}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: CARD PENJUAL & AKSI */}
          <div className="lg:col-span-3">
            <div className="sticky top-32">
              <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5">
                <h3 className="mb-4 text-xs font-bold tracking-widest text-[var(--gray-placeholder)] uppercase">
                  Informasi Penjual
                </h3>
                <div className="mb-6 flex items-center gap-4">
                  <img
                    src={product.penjual_avatar}
                    alt={product.penjual_nama}
                    className="h-14 w-14 rounded-full ring-2 ring-[var(--gray-shine)]"
                  />
                  <div>
                    <div className="text-[15px] font-bold text-[var(--dark-text)]">
                      {product.penjual_nama}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--gray)]">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--cyan)]"></span>{" "}
                      Aktif
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-2xl border border-[var(--primary)]/5 bg-[var(--gray-shine)] p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-white p-2 text-[var(--primary)] shadow-sm">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-bold tracking-wider text-[var(--gray-placeholder)] uppercase">
                        Titik COD
                      </p>
                      <p className="text-sm leading-snug font-semibold text-[var(--dark-text)]">
                        {product.lokasi_cod}
                      </p>
                    </div>
                  </div>
                </div>

                {product.status_ketersediaan === "Terjual" ? (
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl bg-gray-100 py-4 font-bold text-[var(--gray-placeholder)]"
                  >
                    Barang Sudah Terjual
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* TOMBOL UTAMA: NAVIGASI KE HALAMAN PETA */}
                    <button
                      onClick={handleGoToMap}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] py-4 font-bold text-white shadow-[var(--primary)]/20 shadow-lg transition-all hover:bg-[var(--primary-dark)] active:scale-95"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Lihat Lokasinya
                    </button>

                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-3.5 font-bold text-white shadow-md transition-all hover:bg-[var(--accent-dark)] active:scale-95">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
