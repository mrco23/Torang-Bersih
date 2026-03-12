import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { marketplaceAPI } from "../../../../services/api/routes/marketplace.route";
import {
  KONDISI_LABELS,
  formatHarga,
} from "../barangbekas/InputBarang/Constant";

// Custom Marker Icon
const customMarkerIcon = new L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="relative flex items-center justify-center size-10">
      <div class="absolute size-full bg-(--primary) rounded-full animate-ping opacity-40"></div>
      <div class="relative size-6 bg-(--primary) border-2 border-white rounded-full shadow-md z-10"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const BarangBekasDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await marketplaceAPI.getById(id);
        setProduct(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat data barang");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleGoToMap = () => {
    if (!product) return;
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

  const getKondisiStyle = (kondisi) => {
    const label = KONDISI_LABELS[kondisi];
    if (label) return `${label.bg} ${label.color} ring-1 ring-gray-200`;
    return "bg-gray-50 text-gray-600 ring-1 ring-gray-200";
  };

  const getWhatsappLink = (kontak) => {
    if (!kontak) return null;
    const num = kontak.replace(/\D/g, "");
    const formatted = num.startsWith("0") ? "62" + num.slice(1) : num;
    return `https://wa.me/${formatted}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pt-28">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-(--primary) border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white pt-28">
        <p className="text-lg font-bold text-gray-800">
          {error || "Barang tidak ditemukan"}
        </p>
        <button
          onClick={() => navigate("/barang-bekas")}
          className="mt-4 rounded-lg bg-(--primary) px-6 py-2.5 font-bold text-white transition hover:bg-(--primary-dark)"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const fotos = product.foto_barang_urls || [];
  const kondisiLabel = KONDISI_LABELS[product.kondisi]?.text || product.kondisi;
  const waLink = getWhatsappLink(product.kontak);

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 selection:bg-(--gray-shine) selection:text-(--primary)">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* KOLOM KIRI: GALERI FOTO */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="group relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-(--gray-shine) sm:aspect-square">
              {product.status_ketersediaan === "terjual" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                  <span className="-rotate-6 transform rounded-xl bg-(--dark) px-6 py-3 text-lg font-black tracking-widest text-white shadow-xl">
                    TERJUAL
                  </span>
                </div>
              )}
              <img
                src={fotos[activeImageIndex] || "/placeholder.jpg"}
                alt={product.nama_barang}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {fotos.length > 1 && (
              <div className="scrollbar-hide flex gap-4 overflow-x-auto px-1 py-2">
                {fotos.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl transition-all duration-300 ${activeImageIndex === idx ? "opacity-100 shadow-md ring-2 ring-(--primary) ring-offset-2" : "opacity-60 ring-1 ring-gray-200 hover:opacity-100"}`}
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
              <span className="mb-3 block text-xs font-bold tracking-widest text-(--accent) uppercase">
                Kategori {product.kategori_barang?.nama || "-"}
              </span>
              <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-(--dark) sm:text-4xl">
                {product.nama_barang}
              </h1>
            </div>

            <div className="mb-8">
              <p className="mb-1 text-sm font-medium text-(--gray)">
                Harga Barang
              </p>
              <div className="flex items-baseline gap-2 text-4xl font-black tracking-tighter text-(--primary)">
                {product.harga === 0 ? (
                  <span className="text-(--accent)">Gratis (Donasi)</span>
                ) : (
                  formatHarga(product.harga)
                )}
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
              <span
                className={`rounded-xl px-4 py-2 text-xs font-bold tracking-wide uppercase ${getKondisiStyle(product.kondisi)}`}
              >
                Kondisi: {kondisiLabel}
              </span>
              {product.berat_estimasi_kg && (
                <span className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-(--dark-text) shadow-sm ring-1 ring-gray-200">
                  Estimasi {product.berat_estimasi_kg} kg
                </span>
              )}
            </div>

            <hr className="mb-8 border-gray-100" />

            <div className="mb-10">
              <h3 className="mb-4 text-lg font-bold text-(--dark)">
                Deskripsi
              </h3>
              <p className="text-[15px] leading-relaxed whitespace-pre-line text-(--gray-muted)">
                {product.deskripsi_barang || "Tidak ada deskripsi."}
              </p>
            </div>

            {/* PETA MINI */}
            {product.latitude && product.longitude && (
              <div className="mb-10 border-t border-gray-100 pt-4">
                <h3 className="mb-4 text-lg font-bold text-balance text-(--dark)">
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
                        <b>{product.penjual?.full_name || "Penjual"}</b>
                        <br />
                        {product.kabupaten_kota}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* KOLOM KANAN: CARD PENJUAL & AKSI */}
          <div className="lg:col-span-3">
            <div className="sticky top-32">
              <div className="rounded-4xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5">
                <h3 className="mb-4 text-xs font-bold tracking-widest text-(--gray-placeholder) uppercase">
                  Informasi Penjual
                </h3>
                <div className="mb-6 flex items-center gap-4">
                  <img
                    src={
                      product.penjual?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(product.penjual?.full_name || "User")}&background=1e1f78&color=fff`
                    }
                    alt={product.penjual?.full_name}
                    className="h-14 w-14 rounded-full ring-2 ring-(--gray-shine)"
                  />
                  <div>
                    <div className="text-[15px] font-bold text-(--dark-text)">
                      {product.penjual?.full_name ||
                        product.penjual?.username ||
                        "Anonim"}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-(--gray)">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-(--cyan)"></span>
                      Aktif
                    </div>
                  </div>
                </div>

                {product.kabupaten_kota && (
                  <div className="mb-6 rounded-2xl border border-(--primary)/5 bg-(--gray-shine) p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-white p-2 text-(--primary) shadow-sm">
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
                        <p className="mb-1 text-[11px] font-bold tracking-wider text-(--gray-placeholder) uppercase">
                          Titik COD
                        </p>
                        <p className="text-sm leading-snug font-semibold text-(--dark-text)">
                          {product.kabupaten_kota}
                        </p>
                        {product.alamat_lengkap && (
                          <p className="mt-0.5 text-xs text-(--gray)">
                            {product.alamat_lengkap}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {product.status_ketersediaan === "terjual" ? (
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl bg-gray-100 py-4 font-bold text-(--gray-placeholder)"
                  >
                    Barang Sudah Terjual
                  </button>
                ) : (
                  <div className="space-y-3">
                    {product.latitude && product.longitude && (
                      <button
                        onClick={handleGoToMap}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--primary) py-4 font-bold text-white shadow-(--primary)/20 shadow-lg transition-all hover:bg-(--primary-dark) active:scale-95"
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
                    )}

                    {waLink ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--accent) py-3.5 font-bold text-white shadow-md transition-all hover:bg-(--accent-dark) active:scale-95"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Chat Penjual
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-200 py-3.5 font-bold text-gray-400"
                      >
                        Kontak tidak tersedia
                      </button>
                    )}
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
