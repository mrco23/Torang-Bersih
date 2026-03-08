import React from "react";
// Pastikan library leaflet sudah diinstal: npm install leaflet react-leaflet
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
  // DATA DUMMY ASET (Berdasarkan Field Database yang Anda berikan)
  const aset = {
    id: 1,
    nama_aset: "TPST Malalayang Terpadu",
    kategori_aset: "TPST", // ENUM: Bank Sampah, TPA, Composting, Kendaraan, TPST
    status_aktif: true,
    kabupaten_kota: "Kota Manado",
    kecamatan: "Malalayang",
    alamat_lengkap:
      "Jl. Wolter Monginsidi, Malalayang Dua, Kec. Malalayang, Kota Manado, Sulawesi Utara 95116",
    desk: "lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
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

  return (
    <div className="min-h-dvh bg-white pt-30 pb-20 selection:bg-(--gray-shine) selection:text-(--primary)">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            {/* Status Aktif Badge */}
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
          <p>{aset.desk}</p>

          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-(--gray)">
            <span className="cursor-pointer underline decoration-gray-300 underline-offset-4 transition-colors hover:text-(--dark)">
              Kec. {aset.kecamatan}, {aset.kabupaten_kota}
            </span>
          </div>
        </div>

        <div className="group relative mb-12 grid h-[300px] grid-cols-1 gap-2 overflow-hidden rounded-2xl sm:h-[400px] md:h-[460px] md:grid-cols-4">
          {/* Foto Besar di Kiri */}
          <div className="h-full bg-gray-100 md:col-span-2">
            <img
              src={aset.foto_aset_urls[0]}
              alt="Fasilitas Utama"
              className="size-full cursor-pointer object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          {/* Grid Kanan (Tumpukan Foto) */}
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
              {/* Overlay Tombol "Lihat Semua Foto" ala Airbnb */}
              <button className="absolute right-4 bottom-4 rounded-lg bg-white px-4 py-2 text-sm font-bold text-(--dark) shadow-md ring-1 ring-gray-900/5 transition-transform hover:scale-105 active:scale-95">
                Lihat semua foto
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-20">
          {/* ---- KOLOM KIRI (INFO FASILITAS & PETA) ---- */}
          <div className="flex flex-col gap-8 pb-10 lg:col-span-7">
            {/* Info Kategori & PIC */}
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
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-(--gray-shine) text-xl font-bold text-(--primary) shadow-sm">
                {aset.nama_pic.charAt(0)}
              </div>
            </div>

            {/* Peta Interaktif Leaflet */}
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
                  scrollWheelZoom={false} // Dimatikan agar tidak ganggu user scroll ke bawah
                  style={{ height: "100%", width: "100%", zIndex: 0 }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[aset.latitude, aset.longitude]}
                    icon={customMarkerIcon}
                  >
                    <Popup className="">
                      <strong className="text-(--dark)">
                        {aset.nama_aset}
                      </strong>
                      <br />
                      <span className="text-xs text-(--gray)">
                        {aset.kategori_aset}
                      </span>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              <p className="mt-4 text-sm leading-snug font-medium text-pretty text-(--dark-text)">
                {aset.alamat_lengkap}
              </p>
              <p className="mt-1 text-xs text-(--gray-placeholder)">
                Koordinat: {aset.latitude}, {aset.longitude}
              </p>
            </div>
          </div>

          {/* ---- KOLOM KANAN (STICKY ACTION CARD) ---- */}
          <div className="relative z-10 lg:col-span-5">
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_6px_24px_rgb(0,0,0,0.08)]">
              {/* Header Card */}
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
                {/* Ikon Kategori Aset sbg dekorasi */}
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

              {/* Kontak Info Box */}
              <div className="mb-6 overflow-hidden rounded-xl border border-gray-300">
                <div className="flex items-start gap-3 bg-gray-50 p-3">
                  <svg
                    className="mt-0.5 size-5 text-(--gray)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div>
                    <div className="text-[10px] font-bold text-(--gray-placeholder) uppercase">
                      Penanggung Jawab (PIC)
                    </div>
                    <div className="text-sm font-bold text-(--dark-text)">
                      {aset.nama_pic}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Utama WA */}
              <a
                href={`https://wa.me/${aset.no_whatsapp_pic.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-bold text-white shadow-md transition-colors hover:bg-[#1EBE57] active:scale-[0.98]"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAset;
