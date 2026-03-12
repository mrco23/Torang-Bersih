import React from "react";
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

const DetailLaporanMap = ({ laporan }) => {
  return (
    <div className="border-t border-gray-100 pt-8">
      <h2 className="mb-4 text-xl font-extrabold text-gray-900">
        Titik Koordinat Lokasi
      </h2>
      <p className="mb-4 text-[15px] leading-relaxed font-medium text-pretty text-gray-600 italic">
        {laporan.alamat_lokasi}
      </p>
      <div className="relative z-0 h-[300px] w-full overflow-hidden rounded-3xl bg-gray-100 ring-1 ring-gray-900/5">
        {laporan.latitude && laporan.longitude ? (
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
        ) : (
          <div className="flex size-full items-center justify-center text-gray-400">
            Koordinat tidak tersedia
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailLaporanMap;
