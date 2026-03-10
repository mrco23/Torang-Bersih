import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Hook untuk menangkap state navigasi
import SidebarPeta from "../../components/features/public/peta/SidebarPeta";
import MapView from "../../components/features/public/peta/MapView";

const PetaPage = () => {
  const location = useLocation(); // Inisialisasi useLocation

  // Semua kategori otomatis dicentang di awal
  const [filters, setFilters] = useState([
    "Kolaborator",
    "Aset",
    "Laporan Sampah",
    "Barang Daur Ulang",
  ]);

  // State untuk melacak lokasi mana yang aktif di peta
  const [selectedLocation, setSelectedLocation] = useState(null);

  // LOGIKA PENANGKAP STATE:
  // Menangkap data yang dikirim via navigate('/peta', { state: { targetLocation: ... } })
  useEffect(() => {
    if (location.state?.targetLocation) {
      // Jika ada kiriman lokasi, langsung set sebagai lokasi terpilih
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedLocation(location.state.targetLocation);

      // Opsional: Pastikan kategori lokasi tersebut aktif di filter agar marker muncul
      const targetType = location.state.targetLocation.type;
      if (targetType && !filters.includes(targetType)) {
        setFilters((prev) => [...prev, targetType]);
      }
    }
  }, [location.state, filters]);

  // Dummy Data
  const allLocations = [
    {
      id: 1,
      name: "Bank Sampah Wanea",
      lat: 1.4589,
      lng: 124.8385,
      type: "Kolaborator",
      status: "Buka",
    },
    {
      id: 2,
      name: "TPST Tuminting Terpadu",
      lat: 1.502,
      lng: 124.845,
      type: "Aset",
      status: "Beroperasi",
    },
    {
      id: 3,
      name: "Tumpukan Liar Muara Bahu",
      lat: 1.455,
      lng: 124.832,
      type: "Laporan Sampah",
      status: "Menunggu",
    },
    {
      id: 4,
      name: "Kardus Bekas 50kg (Gratis)",
      lat: 1.487,
      lng: 124.831,
      type: "Barang Daur Ulang",
      status: "Tersedia",
    },
    {
      id: 5,
      name: "Trash Hero Manado",
      lat: 1.47,
      lng: 124.84,
      type: "Kolaborator",
      status: "Komunitas",
    },
  ];

  // Data yang dilempar ke komponen anak adalah data yang sudah difilter
  const filteredLocations = allLocations.filter((loc) =>
    filters.includes(loc.type),
  );

  // Fungsi saat card di sidebar diklik
  const handleCardClick = (locationData) => {
    setSelectedLocation(locationData);
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white pt-20 selection:bg-(--gray-shine) selection:text-(--primary)">
      <div className="relative flex flex-1 overflow-hidden">
        {/* Komponen Kiri: Sidebar Filter & List */}
        <SidebarPeta
          filters={filters}
          setFilters={setFilters}
          locations={filteredLocations}
          onCardClick={handleCardClick}
        />

        {/* Komponen Kanan: Peta Interaktif */}
        <MapView
          locations={filteredLocations}
          selectedLocation={selectedLocation}
        />

        {/* Floating Button Filter Mobile (Hanya muncul di HP) */}
        <button className="absolute bottom-6 left-1/2 z-1000 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-gray-900/30 active:scale-95 md:hidden">
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter & Daftar
        </button>
      </div>
    </div>
  );
};

export default PetaPage;
