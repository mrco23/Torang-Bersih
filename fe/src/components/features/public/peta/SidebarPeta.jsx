import React, { useState } from "react";

const SidebarPeta = ({
  filters,
  setFilters,
  subFilters,
  setSubFilters,
  allLocations, // We need all original data to build the filter options
  locations, // The filtered data to display
  onCardClick,
  searchQuery,
  setSearchQuery,
  userLocation,
  isOpen,
  onClose,
}) => {
  // Extract unique subitems dynamically from all available locations
  const extractSubItems = React.useCallback(
    (category) => {
      if (!allLocations) return [];
      const items = allLocations
        .filter((loc) => loc.type === category)
        .flatMap((loc) => {
          if (!loc.detail) return [];
          switch (category) {
            case "Kolaborator":
              return loc.detail.jenis_kolaborator
                ? [loc.detail.jenis_kolaborator]
                : [];
            case "Aset":
              return loc.detail.kategori_aset ? [loc.detail.kategori_aset] : [];
            case "Laporan Sampah":
              return [loc.detail.status_laporan].filter(Boolean);
            case "Barang Daur Ulang":
              return [loc.detail.kategori_barang].filter(Boolean);
            default:
              return [];
          }
        });
      return [...new Set(items)].sort();
    },
    [allLocations],
  );

  const FILTER_DEFINITIONS = React.useMemo(
    () => [
      {
        id: "Kolaborator",
        label: "Kolaborator",
        subItems: extractSubItems("Kolaborator"),
      },
      { id: "Aset", label: "Aset", subItems: extractSubItems("Aset") },
      {
        id: "Laporan Sampah",
        label: "Laporan Sampah",
        subItems: extractSubItems("Laporan Sampah"),
      },
      {
        id: "Barang Daur Ulang",
        label: "Barang Daur Ulang",
        subItems: extractSubItems("Barang Daur Ulang"),
      },
    ],
    [extractSubItems],
  );

  const [visibleCount, setVisibleCount] = useState(15);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [isResultExpanded, setIsResultExpanded] = useState(true);

  // Track expansion state of sub-filters for each category
  const [expandedCategories, setExpandedCategories] = useState({
    Kolaborator: false,
    Aset: false,
    "Laporan Sampah": false,
    "Barang Daur Ulang": false,
  });

  const toggleCategoryExpand = (categoryId, e) => {
    e.preventDefault(); // Prevent checkbox toggle if clicking the expand button
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Initialize subFilters with all available options when data loads
  React.useEffect(() => {
    if (allLocations && allLocations.length > 0) {
      // Check if any category is still null (uninitialized)
      const needsInit = Object.values(subFilters).some((v) => v === null);
      if (needsInit) {
        const initialSubFilters = {};
        FILTER_DEFINITIONS.forEach((def) => {
          // Only initialize if currently null, preserving user changes if somehow already interacted
          initialSubFilters[def.id] =
            subFilters[def.id] === null ? def.subItems : subFilters[def.id];
        });
        setSubFilters((prev) => ({ ...prev, ...initialSubFilters }));
      }
    }
  }, [allLocations, subFilters, setSubFilters, FILTER_DEFINITIONS]);

  // Handle Toggle Checkbox Main Category
  const handleFilterChange = (category) => {
    setFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setVisibleCount(15);
  };

  // Handle Toggle Sub Filter
  const handleSubFilterChange = (categoryId, subItem) => {
    setSubFilters((prev) => {
      const activeSubs = prev[categoryId] || [];
      const isSubActive = activeSubs.includes(subItem);
      return {
        ...prev,
        [categoryId]: isSubActive
          ? activeSubs.filter((i) => i !== subItem)
          : [...activeSubs, subItem],
      };
    });
    setVisibleCount(15);
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

          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className={`mb-3 flex w-full items-center justify-between text-[11px] font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-gray-600`}
          >
            <span>Filter & Kategori</span>
            <svg
              className={`size-4 transition-transform duration-300 ${isFilterExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 flex flex-col gap-2 overflow-y-auto pr-2 transition-all duration-300 ${isFilterExpanded ? "h-62 opacity-100" : "h-0 overflow-hidden opacity-0"}`}
          >
            {FILTER_DEFINITIONS.map((cat) => {
              const isCatActive = filters.includes(cat.id);
              const activeSubs = subFilters?.[cat.id] || [];
              const isCatExpanded = expandedCategories[cat.id];

              return (
                <div
                  key={cat.id}
                  className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:border-gray-200"
                >
                  {/* Parent Category Header */}
                  <div className="flex items-center justify-between">
                    <label className="group flex flex-1 cursor-pointer items-center gap-3">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={isCatActive}
                          onChange={() => handleFilterChange(cat.id)}
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
                      <span
                        className={`text-sm font-bold transition-colors ${isCatActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"}`}
                      >
                        {cat.label}
                      </span>
                    </label>

                    {/* Sub-filter Expand Toggle Button */}
                    {isCatActive && cat.subItems.length > 0 && (
                      <button
                        onClick={(e) => toggleCategoryExpand(cat.id, e)}
                        className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                      >
                        <svg
                          className={`size-4 transition-transform duration-300 ${isCatExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Sub Filters Container (Only show if parent is active and expanded) */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${isCatActive && isCatExpanded ? "mt-2 max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="ml-2.5 flex flex-col gap-2 border-l-2 border-gray-200 pl-3">
                      {cat.subItems.map((sub) => {
                        const isSubActive = activeSubs.includes(sub);
                        return (
                          <label
                            key={sub}
                            className="group flex cursor-pointer items-center gap-2.5"
                          >
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={isSubActive}
                                onChange={() =>
                                  handleSubFilterChange(cat.id, sub)
                                }
                                className="peer size-4 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-(--primary) checked:bg-(--primary)"
                              />
                              <svg
                                className="pointer-events-none absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
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
                            <span
                              className={`text-[11px] font-semibold capitalize transition-colors ${isSubActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`}
                            >
                              {sub.replace(/_/g, " ")}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* List Hasil Pencarian */}
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-50/50 p-4">
          <button
            onClick={() => setIsResultExpanded(!isResultExpanded)}
            className="mb-3 flex w-full shrink-0 items-center justify-between px-1 text-xs font-bold text-gray-400 transition-colors hover:text-gray-600"
          >
            <span>{displayLocations.length} Lokasi ditemukan</span>
            <svg
              className={`size-4 transition-transform duration-300 ${isResultExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            className={`scrollbar-hide flex flex-col gap-3 overflow-y-auto transition-all duration-300 ${isResultExpanded ? "h-full opacity-100" : "h-0 overflow-hidden opacity-0"}`}
          >
            {displayLocations.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-4">
                  <svg
                    className="size-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Lokasi tidak ditemukan
                </h3>
                <p className="text-xs text-gray-500">
                  Coba ubah kata kunci pencarian atau filter kategori Anda.
                </p>
              </div>
            ) : (
              <>
                {displayLocations.slice(0, visibleCount).map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => onCardClick(loc)}
                    className="group flex cursor-pointer gap-3.5 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-(--primary) hover:shadow-md active:scale-95"
                  >
                    {/* Thumbnail */}
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {loc.image_url ? (
                        <img
                          src={loc.image_url}
                          alt={loc.name}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-gray-300">
                          <svg
                            className="size-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-center overflow-hidden">
                      <span
                        className={`inline-block self-start rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase ring-1 ring-inset ${getBadgeStyle(loc.type)}`}
                      >
                        {loc.type}
                      </span>
                      <h4 className="mt-1.5 truncate text-sm leading-snug font-bold text-gray-900">
                        {loc.name}
                      </h4>

                      {/* Contextual Data */}
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-gray-500">
                        {loc.type === "Barang Daur Ulang" && loc.detail && (
                          <>
                            <span className="font-bold text-emerald-600">
                              Rp{" "}
                              {(loc.detail.harga || 0).toLocaleString("id-ID")}
                            </span>
                            <span>•</span>
                            <span className="capitalize">
                              {(loc.detail.kondisi || "").replace(/_/g, " ")}
                            </span>
                          </>
                        )}
                        {loc.type === "Laporan Sampah" && loc.detail && (
                          <>
                            <span
                              className={`font-bold capitalize ${loc.detail.status_laporan === "selesai" || loc.detail.status_laporan === "ditindak" ? "text-emerald-600" : "text-amber-600"}`}
                            >
                              {loc.detail.status_laporan}
                            </span>
                            <span>•</span>
                            <span>
                              {loc.detail.jenis_sampah || "-"} (
                              {loc.detail.estimasi_berat_kg || 0}kg)
                            </span>
                          </>
                        )}
                        {(loc.type === "Aset" || loc.type === "Kolaborator") &&
                          loc.detail && (
                            <span className="truncate">
                              {loc.detail.jenis_kolaborator ||
                                loc.detail.kategori_aset ||
                                "-"}
                            </span>
                          )}
                      </div>

                      {loc.distance !== null && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-(--primary)">
                          <svg
                            className="size-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                          {loc.distance < 1
                            ? `${(loc.distance * 1000).toFixed(0)} m`
                            : `${loc.distance.toFixed(1)} km`}
                        </div>
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
                    Tampilkan Lebih Banyak (
                    {displayLocations.length - visibleCount} lagi)
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarPeta;
