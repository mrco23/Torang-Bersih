import React from "react";
import { useNavigate } from "react-router-dom"; // Import untuk navigasi
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Marker Icon Leaflet
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

const DetailAset = () => {
  const navigate = useNavigate();

  // DATA DUMMY ASET
  const aset = {
    id: 1,
    nama_aset: "TPST Malalayang Terpadu",
    kategori_aset: "TPST",
    status_aktif: true,
    kabupaten_kota: "Kota Manado",
    kecamatan: "Malalayang",
    alamat_lengkap:
      "Jl. Wolter Monginsidi, Malalayang Dua, Kec. Malalayang, Kota Manado, Sulawesi Utara 95116",
    desk: "TPST Malalayang Terpadu merupakan fasilitas pengolahan sampah utama yang melayani wilayah Malalayang dan sekitarnya dengan sistem pemilahan sampah modern.",
    latitude: 1.4589,
    longitude: 124.8385,
    nama_pic: "Budi Santoso",
    no_whatsapp_pic: "+6281234567890",

    foto_aset_urls: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
    ],
  };

  // Fungsi untuk navigasi ke halaman peta penuh
  const handleGoToMap = () => {
    navigate("/peta", {
      state: {
        targetLocation: {
          lat: aset.latitude,
          lng: aset.longitude,
          name: aset.nama_aset,
          type: "Aset",
          status: aset.status_aktif ? "Beroperasi" : "Tidak Aktif",
        },
      },
    });
  };

  return (
    <div className="min-h-dvh bg-white pt-30 pb-20 selection:bg-(--gray-shine) selection:text-(--primary)">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
                aset.status_aktif
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                  : "bg-red-50 text-red-700 ring-red-600/20"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${aset.status_aktif ? "bg-emerald-500" : "bg-red-500"}`}
              ></span>
              {aset.status_aktif ? "Beroperasi" : "Tidak Aktif"}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold tracking-widest text-gray-700 uppercase">
              {aset.kategori_aset}
            </span>
          </div>

          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-balance text-(--dark) sm:text-[32px]">
            {aset.nama_aset}
          </h1>
          <p className="max-w-3xl leading-relaxed text-(--gray)">{aset.desk}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-(--gray)">
            <span className="cursor-pointer underline decoration-gray-300 underline-offset-4 transition-colors hover:text-(--dark)">
              Kec. {aset.kecamatan}, {aset.kabupaten_kota}
            </span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="group relative mb-12 grid h-[300px] grid-cols-1 gap-2 overflow-hidden rounded-2xl sm:h-[400px] md:h-[460px] md:grid-cols-4">
          <div className="h-full bg-gray-100 md:col-span-2">
            <img
              src={aset.foto_aset_urls[0]}
              alt="Fasilitas Utama"
              className="size-full cursor-pointer object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="hidden h-full grid-cols-2 grid-rows-2 gap-2 md:col-span-2 md:grid">
            <div className="relative size-full overflow-hidden bg-gray-100">
              <img
                src={aset.foto_aset_urls[1]}
                alt="Fasilitas 2"
                className="size-full cursor-pointer object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="relative size-full overflow-hidden bg-gray-100">
              <img
                src={aset.foto_aset_urls[2]}
                alt="Fasilitas 3"
                className="size-full cursor-pointer object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="relative col-span-2 overflow-hidden bg-gray-100">
              <img
                src={aset.foto_aset_urls[3]}
                alt="Fasilitas 4"
                className="size-full cursor-pointer object-cover transition-transform duration-500 hover:scale-105"
              />
              <button className="absolute right-4 bottom-4 rounded-lg bg-white px-4 py-2 text-sm font-bold text-(--dark) shadow-md ring-1 ring-gray-900/5 transition-transform hover:scale-105 active:scale-95">
                Lihat semua foto
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="flex flex-col gap-8 pb-10 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div>
                <h2 className="mb-1 text-xl font-bold text-(--dark) sm:text-2xl">
                  Fasilitas {aset.kategori_aset}
                </h2>
                <p className="text-(--gray)">
                  Dikelola oleh{" "}
                  <span className="font-semibold text-(--dark-text)">
                    {aset.nama_pic}
                  </span>
                </p>
              </div>
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-(--gray-shine) text-xl font-bold text-(--primary) uppercase shadow-sm">
                {aset.nama_pic.charAt(0)}
              </div>
            </div>

            {/* Peta Mini Preview */}
            <div className="pt-2">
              <h3 className="mb-1 text-xl font-bold text-(--dark)">
                Lokasi Fasilitas
              </h3>
              <p className="mb-6 text-[15px] text-(--gray)">
                {aset.kabupaten_kota}, Indonesia
              </p>

              <div className="relative z-0 h-[350px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                <MapContainer
                  center={[aset.latitude, aset.longitude]}
                  zoom={16}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%", zIndex: 0 }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[aset.latitude, aset.longitude]}
                    icon={customMarkerIcon}
                  >
                    <Popup>
                      <strong>{aset.nama_aset}</strong>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <p className="mt-4 text-sm font-medium text-(--dark-text)">
                {aset.alamat_lengkap}
              </p>
            </div>
          </div>

          {/* ---- KOLOM KANAN (ACTION CARD) ---- */}
          <div className="relative z-10 lg:col-span-5">
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_6px_24px_rgb(0,0,0,0.08)]">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="mb-1 text-[11px] font-bold tracking-widest text-(--gray-placeholder) uppercase">
                    Status Operasional
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-3">
                      {aset.status_aktif && (
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      )}
                      <span
                        className={`relative inline-flex size-3 rounded-full ${aset.status_aktif ? "bg-emerald-500" : "bg-red-500"}`}
                      ></span>
                    </span>
                    <span className="font-bold text-(--dark-text)">
                      {aset.status_aktif
                        ? "Fasilitas Beroperasi"
                        : "Fasilitas Tidak Aktif"}
                    </span>
                  </div>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-(--gray-shine) text-(--primary)">
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-3">
                {/* TOMBOL UTAMA: LIHAT LOKASI DI PETA (Pindah Halaman) */}
                <button
                  onClick={handleGoToMap}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) py-4 font-bold text-white shadow-lg transition-all hover:bg-(--primary-dark) active:scale-[0.98]"
                >
                  <svg
                    className="size-5"
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
                  Lihat Lokasi di Peta
                </button>

                <a
                  href={`https://wa.me/${aset.no_whatsapp_pic.replace("+", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3.5 font-bold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Chat via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAset;
