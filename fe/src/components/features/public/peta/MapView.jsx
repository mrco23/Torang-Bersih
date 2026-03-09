import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  LayersControl,
  useMap,
} from "react-leaflet";
import { getCustomIcon } from "./MapIcons";

// Komponen untuk menerbangkan Peta ke koordinat baru
const MapUpdater = ({ centerLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (centerLocation) {
      map.flyTo([centerLocation.lat, centerLocation.lng], 18, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [centerLocation, map]);
  return null;
};

const MapView = ({ locations, selectedLocation }) => {
  const defaultPosition = [1.4748, 124.8421]; // Pusat Manado
  const navigate = useNavigate();

  // FUNGSI 1: Navigasi Internal Aplikasi
  const handleDetailClick = (loc) => {
    switch (loc.type) {
      case "Aset":
        navigate(`/aset/${loc.id}`);
        break;
      case "Laporan Sampah":
        navigate(`/laporan/${loc.id}`);
        break;
      case "Kolaborator":
        navigate(`/kolaborator/${loc.id}`);
        break;
      case "Barang Daur Ulang":
        navigate(`/barang-bekas/${loc.id}`);
        break;
      default:
        console.log("Halaman detail belum tersedia");
        break;
    }
  };

  // FUNGSI 2: Buka Street View Gratis (Tab Baru)
  const handleStreetViewClick = (lat, lng) => {
    // Format URL Google Maps yang akan mengaktifkan mode Street View jika tersedia
    const googleMapsUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="relative z-0 h-full w-full flex-1 bg-[#e5e3df]">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        maxZoom={20}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Layer Control untuk Tema Peta */}
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="Mode Peta (Bersih)">
            <TileLayer
              maxZoom={20}
              attribution="© CARTO"
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Mode Jalan (Detail)">
            <TileLayer
              maxZoom={21}
              attribution="© Google Maps"
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Mode Satelit (Udara)">
            <TileLayer
              maxZoom={20}
              attribution="© Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <ZoomControl position="bottomleft" />
        <MapUpdater centerLocation={selectedLocation} />

        {/* Pembuatan Marker & Popup */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={getCustomIcon(loc.type)}
          >
            <Popup className="custom-popup" closeButton={false} minWidth={240}>
              <div className="m-[-1px] flex w-[280px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5">
                {/* Header Gambar */}
                <div className="relative h-28 w-full bg-gray-200">
                  <img
                    src={
                      loc.type === "Laporan Sampah"
                        ? "https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?auto=format&fit=crop&w=300&q=80"
                        : "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=300&q=80"
                    }
                    alt="Lokasi"
                    className="size-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-extrabold tracking-wider text-gray-900 uppercase shadow-sm backdrop-blur-sm">
                    {loc.type}
                  </div>
                </div>

                {/* Konten Teks */}
                <div className="p-4">
                  <h3 className="mb-1 line-clamp-1 text-[15px] leading-tight font-extrabold text-gray-900">
                    {loc.name}
                  </h3>
                  <div className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <span
                      className={`relative flex size-2 ${loc.status === "Menunggu" ? "text-red-500" : "text-emerald-500"}`}
                    >
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-50"></span>
                      <span className="relative inline-flex size-2 rounded-full bg-current"></span>
                    </span>
                    {loc.status}
                  </div>

                  {/* Kumpulan Tombol Aksi */}
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {/* Tombol ke Detail Torang Bersih */}
                    <button
                      onClick={() => handleDetailClick(loc)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-(--primary) py-2.5 text-[11px] font-bold text-white transition-all hover:bg-(--primary-dark) active:scale-95"
                    >
                      Lihat Detail
                    </button>

                    {/* Tombol ke Google Street View (Tab Baru) */}
                    <button
                      onClick={() => handleStreetViewClick(loc.lat, loc.lng)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 py-2.5 text-[11px] font-bold text-blue-600 shadow-sm ring-1 ring-blue-500/20 transition-all ring-inset hover:bg-blue-600 hover:text-white active:scale-95"
                      title="Buka di Google Maps"
                    >
                      <svg
                        className="size-3.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Street View
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Tombol Floating Lokasi Saya */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          className="flex size-11 items-center justify-center rounded-2xl bg-white/90 shadow-[0_4px_20px_rgb(0,0,0,0.1)] ring-1 ring-gray-900/5 backdrop-blur-md transition-all hover:bg-white hover:text-(--primary) active:scale-95"
          title="Lokasi Saya"
        >
          <svg
            className="size-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 18A6 6 0 1012 6a6 6 0 000 12zM12 2v4m0 12v4m10-10h-4M6 12H2"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapView;
