import React from "react";
// Pastikan library leaflet sudah diinstal: npm install leaflet react-leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  const laporan = {
    id: "REP-2026-0089",
    nama_pelapor: "Warga Peduli (Anonim)",
    // ARRAY FOTO BUKTI (> 1 Foto)
    foto_bukti_urls: [
      "https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?auto=format&fit=crop&w=1200&q=80", // View Luas
      "https://images.unsplash.com/photo-1594705597409-bb4c86ebdc55?auto=format&fit=crop&w=600&q=80", // Detail Jarak Dekat
      "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80", // Sisi Lain
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80", // Ekstra
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

  // Logika pewarnaan badge status
  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          ring: "ring-red-600/20",
          dot: "bg-red-500",
        };
      case "Diterima":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          ring: "ring-amber-600/20",
          dot: "bg-amber-500",
        };
      case "Ditindak":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          ring: "ring-blue-600/20",
          dot: "bg-blue-500",
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

  // Format Tanggal
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
                <span className="flex items-center gap-1 font-medium text-gray-500">
                  <svg
                    className="size-4"
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

            {/* Tombol Bagikan / Dukung */}
            <div className="flex shrink-0 items-center gap-2">
              <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200 transition-all ring-inset hover:bg-gray-50 active:scale-95">
                <svg
                  className="size-4"
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

        {/* ==========================================
            2. MULTI-PHOTO GALLERY (AIRBNB STYLE GRID)
            ========================================== */}
        <div className="group relative mb-12 flex h-[300px] w-full gap-2 overflow-hidden rounded-3xl sm:h-[400px] md:h-[480px]">
          {/* Foto Utama (Kiri, 50% width) */}
          <div className="relative h-full w-full overflow-hidden bg-gray-100 md:w-1/2">
            <img
              src={laporan.foto_bukti_urls[0]}
              alt="Bukti 1"
              className="size-full cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Foto Tambahan (Kanan, 50% width, Grid 2x2) */}
          <div className="hidden h-full w-1/2 grid-cols-2 grid-rows-2 gap-2 md:grid">
            {laporan.foto_bukti_urls.slice(1, 4).map((url, idx) => (
              <div
                key={idx}
                className="relative size-full overflow-hidden bg-gray-100"
              >
                <img
                  src={url}
                  alt={`Bukti ${idx + 2}`}
                  className="size-full cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Overlay "Lihat Semua" di foto terakhir jika foto > 3 */}
                {idx === 2 && laporan.foto_bukti_urls.length > 3 && (
                  <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-white backdrop-blur-[2px] transition-colors hover:bg-black/50">
                    <span className="font-bold">
                      +{laporan.foto_bukti_urls.length - 3} Foto Lainnya
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Floating Button Gallery (Mobile & Desktop) */}
          <button className="absolute right-4 bottom-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-lg ring-1 ring-gray-900/10 transition-transform active:scale-95">
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Tampilkan semua foto
          </button>
        </div>

        {/* ==========================================
            3. MAIN CONTENT (7:5 SPLIT)
            ========================================== */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ---- KOLOM KIRI (KRONOLOGI & DETAIL TEKNIS) ---- */}
          <div className="flex flex-col gap-10 pb-10 lg:col-span-7">
            {/* Profil Pelapor */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
              <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
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

            {/* Kronologi Teks */}
            <div>
              <h2 className="mb-4 text-xl font-extrabold text-gray-900">
                Kronologi & Deskripsi
              </h2>
              <p className="text-base leading-relaxed text-pretty whitespace-pre-line text-gray-600">
                {laporan.deskripsi_kronologi}
              </p>
            </div>

            {/* BENTO BOX (Detail Karakteristik Sampah) */}
            <div>
              <h2 className="mb-4 text-xl font-extrabold text-gray-900">
                Karakteristik Timbulan
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-gray-900/5 ring-inset">
                  <span className="mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Jenis Utama
                  </span>
                  <span className="text-sm leading-snug font-bold text-gray-900">
                    {laporan.jenis_sampah}
                  </span>
                </div>
                <div className="flex flex-col rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-gray-900/5 ring-inset">
                  <span className="mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Perkiraan Berat
                  </span>
                  <span className="text-sm leading-snug font-bold text-gray-900">
                    ~ {laporan.estimasi_berat_kg} kg
                  </span>
                </div>
                <div className="flex flex-col rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-gray-900/5 ring-inset">
                  <span className="mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Sifat Limbah
                  </span>
                  <span className="text-sm leading-snug font-bold text-gray-900">
                    {laporan.karakteristik}
                  </span>
                </div>
                <div className="flex flex-col rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-gray-900/5 ring-inset">
                  <span className="mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Bentuk Polusi
                  </span>
                  <span className="text-sm leading-snug font-bold text-gray-900">
                    {laporan.bentuk_timbulan}
                  </span>
                </div>
              </div>
            </div>

            {/* PETA KOORDINAT TEPAT */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="mb-4 text-xl font-extrabold text-gray-900">
                Titik Koordinat Lokasi
              </h2>
              <p className="mb-4 text-[15px] leading-relaxed text-pretty text-gray-600">
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

          {/* ---- KOLOM KANAN (STICKY TIMELINE & ACTION) ---- */}
          <div className="relative z-10 lg:col-span-5">
            <div className="sticky top-28 rounded-3xl bg-white p-6 shadow-xl ring-1 shadow-gray-200/40 ring-gray-900/5 sm:p-8">
              <h3 className="mb-6 text-xl font-extrabold text-gray-900">
                Pelacakan Laporan
              </h3>

              {/* TIMELINE (Minimalist Vercel Style) */}
              <div className="relative ml-2 space-y-8 border-l-[3px] border-gray-100 pb-4">
                {/* Status Saat Ini (Active) */}
                <div className="relative pl-6">
                  <span className="absolute top-1 -left-[11px] flex size-5 items-center justify-center rounded-full bg-red-50 ring-4 ring-white">
                    <span className="size-2.5 animate-pulse rounded-full bg-red-500"></span>
                  </span>
                  <div className="flex flex-col">
                    <span className="mb-1 text-xs font-bold tracking-widest text-red-500 uppercase">
                      Saat Ini
                    </span>
                    <h4 className="text-base font-bold text-gray-900">
                      Menunggu Tindakan
                    </h4>
                    <p className="mt-1 text-sm text-pretty text-gray-500">
                      Laporan sedang disiarkan ke jaringan kolaborator dan Bank
                      Sampah di sekitar Kota Manado.
                    </p>
                  </div>
                </div>

                {/* Status Masa Lalu */}
                <div className="relative pl-6 opacity-60">
                  <span className="absolute top-1 -left-[11px] flex size-5 items-center justify-center rounded-full bg-gray-200 ring-4 ring-white"></span>
                  <div className="flex flex-col">
                    <span className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                      Diterima Sistem
                    </span>
                    <h4 className="text-base font-bold text-gray-900">
                      Verifikasi Lokasi Selesai
                    </h4>
                  </div>
                </div>

                <div className="relative pl-6 opacity-60">
                  <span className="absolute top-1 -left-[11px] flex size-5 items-center justify-center rounded-full bg-gray-200 ring-4 ring-white"></span>
                  <div className="flex flex-col">
                    <span className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                      {formatTanggal(laporan.tanggal_lapor)}
                    </span>
                    <h4 className="text-base font-bold text-gray-900">
                      Laporan Dibuat Warga
                    </h4>
                  </div>
                </div>
              </div>

              {/* ACTION BOX: AJAKAN UNTUK KOLABORATOR */}
              <div className="mt-8 rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-900/5 ring-inset">
                <h4 className="mb-2 text-sm font-bold text-gray-900">
                  Bantu Selesaikan Laporan Ini
                </h4>
                <p className="mb-4 text-[13px] text-pretty text-gray-600">
                  Apakah komunitas atau bank sampah Anda beroperasi di dekat
                  lokasi ini? Ambil alih penanganan dan perbarui statusnya.
                </p>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-gray-800 active:scale-95">
                  Tindak Lanjuti Laporan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailLaporan;
