import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import FormTindakLanjut from "../../components/features/public/Laporan/FormTindakLanjut";

const reportMarkerIcon = new L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="relative flex items-center justify-center size-12">
      <div class="absolute size-full bg-red-500 rounded-full animate-ping opacity-30"></div>
      <div class="relative flex items-center justify-center size-8 bg-red-500 border-[3px] border-white rounded-full shadow-lg z-10 text-white">
        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      </div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
  popupAnchor: [0, -24],
});

const DetailLaporan = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dukungan, setDukungan] = useState(124);
  const [isDukung, setIsDukung] = useState(false);

  // MOCK AUTH STATE
  const isAuthenticated = true;

  const laporan = {
    id: "REP-2026-0089",
    nama_pelapor: "Warga Peduli (Anonim)",
    foto_bukti_urls: [
      "https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594705597409-bb4c86ebdc55?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
    ],
    latitude: 1.455,
    longitude: 124.832,
    alamat_lokasi:
      "Samping jembatan kuning, Jl. Pinggir Sungai Bahu, Kec. Malalayang, Kota Manado",
    jenis_sampah: "Plastik & Residu Domestik",
    estimasi_berat_kg: 150.5,
    karakteristik: "Sulit Didaur Ulang",
    bentuk_timbulan: "Menumpuk di Bantaran",
    status_laporan: "Menunggu",
    tanggal_lapor: "2026-03-08T08:30:00Z",
    deskripsi_kronologi:
      "Terdapat tumpukan sampah plastik dan limbah rumah tangga yang sengaja dibuang di pinggir sungai dekat jembatan. Jika dibiarkan, saat hujan turun sampah ini akan langsung tersapu ke laut. Mohon segera ditindaklanjuti sebelum musim hujan tiba.",
  };

  // FUNGSI NAVIGASI KE PETA PENUH
  const handleGoToMap = () => {
    navigate("/peta", {
      state: {
        targetLocation: {
          lat: laporan.latitude,
          lng: laporan.longitude,
          name: `Laporan: ${laporan.id}`,
          type: "Laporan Sampah",
          status: laporan.status_laporan,
        },
      },
    });
  };

  const handleActionClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/laporan/${laporan.id}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDukungClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/laporan/${laporan.id}`);
    } else {
      setIsDukung(!isDukung);
      setDukungan(isDukung ? dukungan - 1 : dukungan + 1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          ring: "ring-red-600/20",
          dot: "bg-red-500",
        };
      case "Selesai":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          ring: "ring-emerald-600/20",
          dot: "bg-emerald-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          ring: "ring-gray-600/20",
          dot: "bg-gray-500",
        };
    }
  };
  const statusColors = getStatusColor(laporan.status_laporan);

  const formatTanggal = (isoString) => {
    const date = new Date(isoString);
    return (
      date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WITA"
    );
  };

  return (
    <div className="min-h-dvh bg-white pt-30 pb-24 selection:bg-(--gray-shine) selection:text-(--primary)">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-balance text-gray-900 md:text-4xl lg:text-[40px]">
                Timbulan Sampah di {laporan.alamat_lokasi.split(",")[0]}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span
                  className={`flex items-center gap-1.5 rounded-full ${statusColors.bg} px-3 py-1 text-xs font-bold ${statusColors.text} ring-1 ring-inset ${statusColors.ring}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${statusColors.dot} ${laporan.status_laporan === "Menunggu" ? "animate-pulse" : ""}`}
                  ></span>
                  Status: {laporan.status_laporan}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <svg
                    className="size-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Dilaporkan {formatTanggal(laporan.tanggal_lapor)}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={handleDukungClick}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ring-1 transition-all ring-inset active:scale-95 ${isDukung ? "bg-red-50 text-red-600 ring-red-200 hover:bg-red-100" : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"}`}
              >
                <svg
                  className={`size-4 ${isDukung ? "animate-bounce" : ""}`}
                  fill={isDukung ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {dukungan} Dukungan
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200 transition-all ring-inset hover:bg-gray-50 active:scale-95">
                <svg
                  className="size-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Bagikan
              </button>
            </div>
          </div>
        </div>

        {/* GALLERY SECTION */}
        <div className="group relative mb-12 flex h-[300px] w-full gap-2 overflow-hidden rounded-3xl sm:h-[400px] md:h-[480px]">
          <div className="relative h-full w-full overflow-hidden bg-gray-100 md:w-1/2">
            <img
              src={laporan.foto_bukti_urls[0]}
              alt="Bukti 1"
              className={`size-full cursor-pointer object-cover transition-transform duration-700 hover:scale-105 ${laporan.status_laporan === "Selesai" ? "grayscale-[30%]" : ""}`}
            />
          </div>
          <div className="hidden h-full w-1/2 grid-cols-2 grid-rows-2 gap-2 md:grid">
            {laporan.foto_bukti_urls.slice(1, 4).map((url, idx) => (
              <div
                key={idx}
                className="relative size-full overflow-hidden bg-gray-100"
              >
                <img
                  src={url}
                  alt={`Bukti ${idx + 2}`}
                  className={`size-full cursor-pointer object-cover transition-transform duration-700 hover:scale-105 ${laporan.status_laporan === "Selesai" ? "grayscale-[30%]" : ""}`}
                />
              </div>
            ))}
          </div>
          <button className="absolute right-4 bottom-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-lg ring-1 ring-gray-900/10 transition-transform active:scale-95">
            Tampilkan semua foto
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT COLUMN: INFO & MAP */}
          <div className="flex flex-col gap-10 pb-10 lg:col-span-7">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
              <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-400 uppercase">
                {laporan.nama_pelapor.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {laporan.nama_pelapor}
                </p>
                <p className="text-sm text-gray-500">
                  Warga Pelapor (Terverifikasi Sistem)
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-extrabold text-gray-900">
                Kronologi & Deskripsi
              </h2>
              <p className="text-base leading-relaxed font-medium tracking-tight text-pretty whitespace-pre-line text-gray-600">
                {laporan.deskripsi_kronologi}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h2 className="mb-4 text-xl font-extrabold text-gray-900">
                Titik Koordinat Lokasi
              </h2>
              <p className="mb-4 text-[15px] leading-relaxed font-medium text-pretty text-gray-600 italic">
                {laporan.alamat_lokasi}
              </p>
              <div className="relative z-0 h-[300px] w-full overflow-hidden rounded-3xl bg-gray-100 ring-1 ring-gray-900/5">
                <MapContainer
                  center={[laporan.latitude, laporan.longitude]}
                  zoom={17}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%", zIndex: 0 }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[laporan.latitude, laporan.longitude]}
                    icon={reportMarkerIcon}
                  >
                    <Popup className="rounded-xl border-none shadow-xl">
                      <strong className="text-red-600">Titik Sampah</strong>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION & TRACKING */}
          <div className="relative z-10 lg:col-span-5">
            <div className="sticky top-28 rounded-3xl bg-white p-6 shadow-xl ring-1 shadow-gray-200/40 ring-gray-900/5 sm:p-8">
              <h3 className="mb-6 text-xl font-extrabold text-gray-900">
                Pelacakan Laporan
              </h3>

              <div className="relative ml-2 space-y-8 border-l-[3px] border-gray-100 pb-4">
                <div className="relative pl-6">
                  <span
                    className={`absolute top-1 -left-[11px] flex size-5 items-center justify-center rounded-full ring-4 ring-white ${laporan.status_laporan === "Menunggu" ? "bg-red-50" : "bg-emerald-50"}`}
                  >
                    <span
                      className={`size-2.5 rounded-full ${laporan.status_laporan === "Menunggu" ? "animate-pulse bg-red-500" : "bg-emerald-500"}`}
                    ></span>
                  </span>
                  <div className="flex flex-col text-pretty">
                    <span
                      className={`mb-1 text-xs font-bold tracking-widest uppercase ${laporan.status_laporan === "Menunggu" ? "text-red-500" : "text-emerald-500"}`}
                    >
                      Status Saat Ini
                    </span>
                    <h4 className="text-base font-bold text-gray-900">
                      {laporan.status_laporan === "Menunggu"
                        ? "Menunggu Tindakan"
                        : "Penanganan Selesai"}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {laporan.status_laporan === "Menunggu"
                        ? "Laporan sedang disiarkan ke jaringan kolaborator dan Bank Sampah di sekitar Kota Manado."
                        : "Titik sampah telah berhasil dievakuasi dan lokasi telah dibersihkan."}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-8 space-y-3">
                {laporan.status_laporan === "Menunggu" && (
                  <button
                    onClick={handleActionClick}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-95"
                  >
                    Tindak Lanjuti Laporan
                  </button>
                )}

                {/* TOMBOL LIHAT LOKASI DI PETA (NAVIAGSI KE /PETA) */}
                <button
                  onClick={handleGoToMap}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-sm font-bold text-gray-700 ring-1 ring-gray-200 transition-all ring-inset hover:bg-gray-50 active:scale-95"
                >
                  <svg
                    className="size-4"
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormTindakLanjut
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        laporanId={laporan.id}
      />
    </div>
  );
};

export default DetailLaporan;
