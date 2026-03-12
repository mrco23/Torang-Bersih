import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
// Import CSS bawaan leaflet dan default css untuk marker cluster agar tampilannya bundar dan berwarna
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  LayersControl,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
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

const MapView = ({
  locations,
  selectedLocation,
  userLocation,
  onGetLocation,
  isLocating,
}) => {
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

  // Icon khusus untuk Lokasi User (Biru, berkedip)
  const userIcon = new L.divIcon({
    className: "bg-transparent",
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <div class="absolute w-full h-full bg-blue-500 rounded-full animate-ping opacity-60"></div>
        <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg z-10"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });

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

        {/* Marker Lokasi User (GPS) */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup className="custom-popup" closeButton={false} minWidth={150}>
              <div className="p-3 text-center">
                <p className="text-sm font-bold text-gray-900">Lokasi Anda</p>
                <p className="mt-1 text-xs text-gray-500">Akurasi GPS</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker Clustering untuk Data Peta */}
        <MarkerClusterGroup
          chunkedLoading
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          maxClusterRadius={40}
          disableClusteringAtZoom={16}
          spiderfyDistanceMultiplier={2}
        >
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={getCustomIcon(loc.type)}
            >
              <Popup
                className="custom-popup"
                closeButton={false}
                minWidth={240}
              >
                <div className="-m-px flex w-[280px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5">
                  {/* Header Gambar Dinamis */}
                  <div className="relative flex h-28 w-full items-center justify-center overflow-hidden bg-gray-100">
                    {loc.image_url ? (
                      <img
                        src={loc.image_url}
                        alt="Lokasi"
                        className="size-full object-cover"
                      />
                    ) : (
                      <img
                        src={
                          loc.type === "Laporan Sampah"
                            ? "https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?auto=format&fit=crop&w=300&q=80"
                            : "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=300&q=80"
                        }
                        alt="Lokasi"
                        className="size-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-extrabold tracking-wider text-gray-900 uppercase shadow-sm backdrop-blur-sm">
                      {loc.type}
                    </div>
                  </div>

                  {/* Konten Teks */}
                  <div className="p-4">
                    <h3 className="mb-1 line-clamp-1 text-[15px] leading-tight font-extrabold text-gray-900">
                      {loc.name}
                    </h3>
                    {/* Contextual Data for Map Popup */}
                    <div className="mb-4 mt-2 flex flex-col gap-1.5 text-xs">
                      {loc.type === "Barang Daur Ulang" && loc.detail && (
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-600">
                            Rp {(loc.detail.harga || 0).toLocaleString("id-ID")}
                          </span>
                          <span className="font-semibold capitalize text-gray-500">
                            {(loc.detail.kondisi || "").replace(/_/g, " ")}
                          </span>
                        </div>
                      )}

                      {loc.type === "Laporan Sampah" && loc.detail && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className={`relative flex size-2 ${loc.detail.status_laporan === "selesai" || loc.detail.status_laporan === "ditindak" ? "text-emerald-500" : "text-amber-500"}`}>
                              <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-50"></span>
                              <span className="relative inline-flex size-2 rounded-full bg-current"></span>
                            </span>
                            <span className={`capitalize ${loc.detail.status_laporan === "selesai" || loc.detail.status_laporan === "ditindak" ? "text-emerald-600" : "text-amber-600"}`}>
                              {loc.detail.status_laporan}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-gray-500">
                            {loc.detail.jenis_sampah || "-"} ({loc.detail.estimasi_berat_kg || 0}kg)
                          </span>
                        </div>
                      )}

                      {(loc.type === "Aset" || loc.type === "Kolaborator") && loc.detail && (
                        <div className="flex items-center gap-1.5 font-semibold text-gray-500">
                          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="truncate">{loc.detail.jenis_kolaborator || loc.detail.kategori_aset || "-"}</span>
                        </div>
                      )}
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
        </MarkerClusterGroup>
      </MapContainer>

      {/* Tombol Floating Lokasi Saya */}
      <div className="absolute top-8 right-6 z-400 flex flex-col gap-2">
        <button
          onClick={onGetLocation}
          disabled={isLocating}
          className={`flex size-11 items-center justify-center rounded-2xl bg-white/90 shadow-[0_4px_20px_rgb(0,0,0,0.1)] ring-1 ring-gray-900/5 backdrop-blur-md transition-all hover:bg-white hover:text-(--primary) active:scale-95 ${
            isLocating ? "cursor-wait text-(--primary) opacity-70" : ""
          } ${userLocation ? "text-(--primary) shadow-[0_0_15px_rgba(25,118,210,0.3)] ring-(--primary)/50" : "text-gray-700"}`}
          title="Lokasi Saya"
        >
          {isLocating ? (
            <div className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
          ) : (
            <svg
              className="size-5"
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
          )}
        </button>
      </div>
    </div>
  );
};

export default MapView;
