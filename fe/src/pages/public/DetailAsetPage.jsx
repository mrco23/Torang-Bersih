import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { asetAPI } from "../../services/api/routes/aset.route";
import toaster from "../../utils/toaster";

/* ─── Custom Marker Icon ─── */
const customMarkerIcon = new L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="relative flex items-center justify-center" style="width:40px;height:40px">
      <div style="position:absolute;width:100%;height:100%;background:#10b981;border-radius:50%;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;opacity:0.3"></div>
      <div style="position:relative;width:20px;height:20px;background:#059669;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(5,150,105,0.5)"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -24],
});

/* ─── Icon Components ─── */
const Icon = ({ d, className = "size-5", strokeWidth = 1.75 }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={strokeWidth}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const LocationIcon = ({ className }) => (
  <Icon
    className={className}
    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
  />
);
const InfoIcon = ({ className }) => (
  <Icon
    className={className}
    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  />
);
const BuildingIcon = ({ className }) => (
  <Icon
    className={className}
    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
  />
);
const ChevronLeft = ({ className }) => (
  <Icon className={className} d="M15 19l-7-7 7-7" strokeWidth={2.5} />
);
const ChevronRight = ({ className }) => (
  <Icon className={className} d="M9 5l7 7-7 7" strokeWidth={2.5} />
);
const CloseIcon = ({ className }) => (
  <Icon className={className} d="M6 18L18 6M6 6l12 12" strokeWidth={2} />
);
const ExpandIcon = ({ className }) => (
  <Icon
    className={className}
    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
  />
);
const MapIcon = ({ className }) => (
  <Icon
    className={className}
    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
  />
);
const UserIcon = ({ className }) => (
  <Icon
    className={className}
    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  />
);
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ─── Skeleton Loader ─── */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
);

/* ─── Detail Badge ─── */
const DetailBadge = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3.5 ring-1 ring-gray-100">
    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm ring-1 ring-gray-100">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-gray-800">
        {value || "—"}
      </p>
    </div>
  </div>
);

/* ─── Main Component ─── */
const DetailAset = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [aset, setAset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetchAset = async () => {
      try {
        setLoading(true);
        const res = await asetAPI.getById(id);
        setAset(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat detail aset");
        toaster.error(
          err.response?.data?.message || "Gagal memuat detail aset",
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAset();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow =
      selectedPhotoIndex !== null ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedPhotoIndex]);

  useEffect(() => {
    setImgLoaded(false);
  }, [activeHeroIndex]);

  const handleNextPhoto = () => {
    if (!aset?.pictures_urls) return;
    setSelectedPhotoIndex((prev) => (prev + 1) % aset.pictures_urls.length);
  };
  const handlePrevPhoto = () => {
    if (!aset?.pictures_urls) return;
    setSelectedPhotoIndex((prev) =>
      prev === 0 ? aset.pictures_urls.length - 1 : prev - 1,
    );
  };
  const handleGoToMap = () => {
    if (!aset) return;
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

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="min-h-dvh w-full bg-gray-50 px-4 pt-28 pb-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-32 shrink-0 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error || !aset) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-50 px-4 pt-20 text-center">
        <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-red-50 text-red-400">
          <svg
            className="size-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Aset Tidak Ditemukan
        </h2>
        <p className="mb-8 text-sm text-gray-500">
          {error || "Data aset mungkin telah dihapus."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-95"
        >
          <ChevronLeft className="size-4" />
          Kembali
        </button>
      </div>
    );
  }

  const photos = aset.pictures_urls || [];
  const isActive = aset.status_aktif;

  return (
    <div className="min-h-dvh w-full bg-[#f8faf8] px-4 pt-28 pb-24 selection:bg-emerald-100 selection:text-emerald-800 md:px-8">
      {/* ── Lightbox ── */}
      {selectedPhotoIndex !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 z-9999 flex flex-col bg-black/97 backdrop-blur-2xl"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-6 py-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhotoIndex(i)}
                    className={`rounded-full transition-all ${i === selectedPhotoIndex ? "h-2 w-6 bg-white" : "size-2 bg-white/30 hover:bg-white/60"}`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-white/40">
                {selectedPhotoIndex + 1} / {photos.length}
              </span>
            </div>
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          {/* Main image */}
          <div
            className="relative flex flex-1 items-center justify-center px-16"
            onClick={(e) => e.stopPropagation()}
          >
            {photos.length > 1 && (
              <button
                onClick={handlePrevPhoto}
                className="absolute left-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:left-8"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            <img
              src={photos[selectedPhotoIndex]}
              alt={`Foto ${selectedPhotoIndex + 1}`}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
              style={{ maxHeight: "calc(100vh - 160px)" }}
            />
            {photos.length > 1 && (
              <button
                onClick={handleNextPhoto}
                className="absolute right-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:right-8"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>

          {/* Caption */}
          <div
            className="px-6 pt-4 pb-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium text-white/60">
              {aset.nama_aset}
            </p>
          </div>
        </div>
      )}

      {/* ── Page Content ── */}
      <div className="mx-auto w-full max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-emerald-700"
        >
          <ChevronLeft className="size-4" />
          Kembali
        </button>

        {/* ── Page Header ── */}
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase ring-1 ring-inset ${isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-600 ring-red-200"}`}
            >
              <span
                className={`size-1.5 rounded-full ${isActive ? "animate-pulse bg-emerald-500" : "bg-red-500"}`}
              />
              {isActive ? "Beroperasi" : "Tidak Aktif"}
            </span>
            {/* Category Badge */}
            {aset.kategori_aset?.nama && (
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-widest text-gray-500 uppercase ring-1 ring-gray-200">
                {aset.kategori_aset.nama}
              </span>
            )}
          </div>

          <h1 className="mb-3 text-3xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {aset.nama_aset}
          </h1>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <LocationIcon className="size-4 shrink-0 text-emerald-600" />
            <span>{aset.kabupaten_kota || "Lokasi tidak diketahui"}</span>
          </div>
        </header>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-8 lg:col-span-7 xl:col-span-8">
            {/* ── Photo Gallery ── */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              {/* Hero Image */}
              <div
                className="group relative aspect-video w-full cursor-zoom-in overflow-hidden bg-gray-100"
                onClick={() =>
                  photos.length > 0 && setSelectedPhotoIndex(activeHeroIndex)
                }
              >
                {photos.length > 0 ? (
                  <>
                    {!imgLoaded && (
                      <div className="absolute inset-0 animate-pulse bg-gray-200" />
                    )}
                    <img
                      src={photos[activeHeroIndex]}
                      alt="Foto utama aset"
                      className={`size-full object-cover transition-all duration-500 group-hover:scale-[1.02] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                      onLoad={() => setImgLoaded(true)}
                    />
                    {/* Overlay hint */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                      <ExpandIcon className="size-3.5" />
                      Perbesar Foto
                    </div>
                    {photos.length > 1 && (
                      <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
                        {activeHeroIndex + 1} / {photos.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-3 text-gray-300">
                    <svg
                      className="size-14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm font-medium">
                      Tidak ada foto tersedia
                    </p>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3 [&::-webkit-scrollbar]:hidden">
                  {photos.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveHeroIndex(idx)}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all focus:outline-none ${idx === activeHeroIndex ? "ring-2 ring-emerald-500 ring-offset-1" : "opacity-60 hover:opacity-90"}`}
                    >
                      <img
                        src={url}
                        alt={`Foto ${idx + 1}`}
                        className="size-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── About Section ── */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <InfoIcon className="size-4" />
                </div>
                Tentang Fasilitas
              </h2>
              <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-600">
                {aset.deskripsi_aset ||
                  "Belum ada deskripsi yang ditambahkan untuk fasilitas ini."}
              </p>
            </div>

            {/* ── Mini Map ── */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <MapIcon className="size-5 text-emerald-600" />
                    Lokasi Fasilitas
                  </h3>
                  {aset.alamat_lengkap && (
                    <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">
                      {aset.alamat_lengkap}
                    </p>
                  )}
                </div>
              </div>
              <div className="h-64 w-full">
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
                      <span className="font-semibold text-gray-900">
                        {aset.nama_aset}
                      </span>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Sticky Action Card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 space-y-4">
              {/* Main Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
                {/* Card Header — status strip */}
                <div
                  className={`px-6 py-4 ${isActive ? "bg-emerald-600" : "bg-gray-600"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
                        Status Operasional
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${isActive ? "animate-pulse bg-white" : "bg-white/50"}`}
                        />
                        <span className="font-bold text-white">
                          {isActive
                            ? "Fasilitas Beroperasi"
                            : "Fasilitas Tidak Aktif"}
                        </span>
                      </div>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/15">
                      <BuildingIcon className="size-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Manager info */}
                  {aset.penanggung_jawab && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base font-bold text-emerald-700 uppercase">
                        {aset.penanggung_jawab.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                          Dikelola Oleh
                        </p>
                        <p className="mt-0.5 font-semibold text-gray-900">
                          {aset.penanggung_jawab}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Category & Location quick info */}
                  <div className="mb-5 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Kategori</span>
                      <span className="font-semibold text-gray-800">
                        {aset.kategori_aset?.nama || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Wilayah</span>
                      <span className="font-semibold text-gray-800">
                        {aset.kabupaten_kota || "—"}
                      </span>
                    </div>
                    {aset.kontak && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Kontak</span>
                        <span className="font-semibold text-gray-800">
                          {aset.kontak}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleGoToMap}
                      className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                    >
                      <LocationIcon className="size-4.5" />
                      Lihat Lokasi di Peta
                    </button>

                    {aset.kontak && (
                      <a
                        href={`https://wa.me/${aset.kontak.replace("+", "").replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 transition-all hover:border-green-200 hover:bg-green-50 hover:text-green-700 active:scale-[0.98]"
                      >
                        <WhatsAppIcon className="size-4.5 text-green-600" />
                        Chat via WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAset;
