import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// PENTING: Sesuaikan path import ini dengan lokasi file MapIcons.js Anda
import { getCustomIcon } from "../../../../components/features/public/peta/MapIcons"; 

const Peta = () => {
  const navigate = useNavigate();
  const defaultPosition = [1.4748, 124.8421]; // Pusat Manado

  // Data Dummy (Sama dengan PetaPage)
  const locations = [
    { id: 1, name: "Bank Sampah Wanea", lat: 1.4589, lng: 124.8385, type: "Kolaborator", status: "Buka" },
    { id: 2, name: "TPST Tuminting Terpadu", lat: 1.502, lng: 124.845, type: "Aset", status: "Beroperasi" },
    { id: 3, name: "Tumpukan Liar Muara Bahu", lat: 1.455, lng: 124.832, type: "Laporan Sampah", status: "Menunggu" },
    { id: 4, name: "Kardus Bekas 50kg", lat: 1.487, lng: 124.831, type: "Barang Daur Ulang", status: "Tersedia" },
    { id: 5, name: "Trash Hero Manado", lat: 1.470, lng: 124.840, type: "Kolaborator", status: "Komunitas" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="flex w-full justify-center px-4 py-10 md:px-6 md:py-16 "
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <HiOutlineLocationMarker className="text-3xl text-(--cyan)" />
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Jangkauan Kami
            </h2>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-gray-500">
            Memantau dan mengelola persampahan di seluruh wilayah Sulawesi
            Utara, dari kota hingga kabupaten.
          </p>
        </div>

        {/* Kontainer Peta Interaktif */}
        <div className="relative z-0 w-full max-w-[1200px] overflow-hidden rounded-3xl shadow-[0px_10px_40px_rgba(0,0,0,0.08)] ring-1 ring-gray-900/5 h-[450px] md:h-[600px] group">
          
          <MapContainer
            center={defaultPosition}
            zoom={13}
            scrollWheelZoom={false} // MATIKAN AGAR TIDAK MENGGANGGU SCROLL HALAMAN
            className="h-full w-full z-0 bg-[#e5e3df]"
          >
            {/* Menggunakan Tema CartoDB yang Bersih agar terlihat elegan di Landing Page */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* Render Data Lokasi */}
            {locations.map((loc) => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={getCustomIcon(loc.type)}
              >
                <Popup className="custom-popup" closeButton={false} minWidth={220}>
                  <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-900/5 m-[-1px] w-[240px]">
                    <div className="p-4">
                      <span className="mb-2 inline-block rounded-md bg-gray-100 px-2 py-1 text-[9px] font-extrabold tracking-wider text-gray-600 uppercase">
                        {loc.type}
                      </span>
                      <h3 className="mb-1 text-sm font-extrabold leading-tight text-gray-900 line-clamp-1">
                        {loc.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-500">
                        {loc.status}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Tombol Overlay (Teaser) untuk mengajak user ke Peta Penuh */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
            <button 
              onClick={() => navigate('/peta')}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-(--primary) active:scale-95"
            >
              Buka Peta Interaktif Penuh
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default Peta;