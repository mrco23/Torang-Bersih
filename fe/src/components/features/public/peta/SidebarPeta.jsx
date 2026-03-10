import React, { useState } from "react";

const SidebarPeta = ({
  filters,
  setFilters,
  locations,
  onCardClick,
  searchQuery,
  setSearchQuery,
  userLocation,
  isOpen,
  onClose,
}) => {
  const categories = [
    "Kolaborator",
    "Aset",
    "Laporan Sampah",
    "Barang Daur Ulang",
  ];

  const [visibleCount, setVisibleCount] = useState(15);

  // Handle Toggle Checkbox
  const handleFilterChange = (category) => {
    setFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setVisibleCount(15); // Reset limit saat filter berubah
  };

  // Fungsi styling badge dinamis
  const getBadgeStyle = (type) => {
    switch (type) {
      case "Laporan Sampah":
        return "bg-red-50 text-red-600 ring-red-500/20";
      case "Aset":
        return "bg-emerald-50 text-emerald-600 ring-emerald-500/20";
      case "Kolaborator":
        return "bg-blue-50 text-blue-600 ring-blue-500/20";
      case "Barang Daur Ulang":
        return "bg-amber-50 text-amber-600 ring-amber-500/20";
      default:
        return "bg-gray-50 text-gray-600 ring-gray-500/20";
    }
  };

  // Haversine formula untuk hitung jarak (km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius bumi dalam km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Map locations dengan jarak jika userLocation tersedia, lalu sort
  const displayLocations = [...locations]
    .map((loc) => {
      let distance = null;
      if (userLocation) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          loc.lat,
          loc.lng,
        );
      }
      return { ...loc, distance };
    })
    .sort((a, b) => {
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return 0; // fallback jika tidak ada GPS
    });

  return (
    <>
      {/* Mobile Overlay Background */}
      {isOpen && (
        <div
          className="fixed inset-0 z-450 bg-gray-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-500 w-80 shrink-0 flex-col border-r border-gray-200 bg-white shadow-[4px_0_24px_rgb(0,0,0,0.02)] transition-transform duration-300 md:static md:z-10 md:flex md:translate-x-0 ${
          isOpen
            ? "flex translate-x-0"
            : "hidden -translate-x-full pt-16 md:flex md:pt-0"
        }`}
      >
        {/* Header & Filter */}
        <div className="relative shrink-0 border-b border-gray-100 p-6 pt-30! md:pt-10!">
          {/* Tombol Close Mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 md:hidden"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h1 className="mb-1 pr-8 text-xl font-extrabold text-gray-900">
            Peta Torang Bersih
          </h1>
          <p className="mb-6 text-xs font-medium text-gray-500">
            Cari titik pengelolaan sampah terdekat.
          </p>

          {/* Input Pencarian */}
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Cari lokasi atau alamat..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(15); // Reset limit saat search berubah
              }}
              className="w-full rounded-xl border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm transition-all outline-none placeholder:text-gray-400 focus:border-(--primary) focus:bg-white focus:ring-1 focus:ring-(--primary)"
            />
            <svg
              className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <h2 className="mb-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            Filter Kategori
          </h2>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <label
                key={cat}
                className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.includes(cat)}
                    onChange={() => handleFilterChange(cat)}
                    className="peer size-5 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-(--primary) checked:bg-(--primary)"
                  />
                  <svg
                    className="pointer-events-none absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* List Hasil Pencarian */}
        <div className="scrollbar-hide flex-1 overflow-y-auto bg-gray-50/50 p-4">
          <p className="mb-3 px-1 text-xs font-bold text-gray-400">
            {displayLocations.length} Lokasi ditemukan
          </p>
          <div className="flex flex-col gap-3">
            {displayLocations.slice(0, visibleCount).map((loc) => (
              <div
                key={loc.id}
                onClick={() => onCardClick(loc)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-(--primary) hover:shadow-md active:scale-95"
              >
                <span
                  className={`inline-block rounded-md px-2 py-1 text-[10px] font-extrabold tracking-wider uppercase ring-1 ring-inset ${getBadgeStyle(loc.type)}`}
                >
                  {loc.type}
                </span>
                <h4 className="mt-2 text-sm leading-snug font-bold text-gray-900">
                  {loc.name}
                </h4>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <svg
                      className="size-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {loc.status}
                  </div>
                  {loc.distance !== null && (
                    <span className="rounded bg-(--primary)/10 px-1.5 py-0.5 text-[11px] font-bold text-(--primary)">
                      {loc.distance < 1
                        ? `${(loc.distance * 1000).toFixed(0)} m`
                        : `${loc.distance.toFixed(1)} km`}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Tombol Load More */}
            {visibleCount < displayLocations.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 15)}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95"
              >
                Tampilkan Lebih Banyak ({displayLocations.length - visibleCount}{" "}
                lagi)
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarPeta;
