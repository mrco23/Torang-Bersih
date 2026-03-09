import React from 'react';

const SidebarPeta = ({ filters, setFilters, locations, onCardClick }) => {
  const categories = ["Kolaborator", "Aset", "Laporan Sampah", "Barang Daur Ulang"];

  // Handle Toggle Checkbox
  const handleFilterChange = (category) => {
    setFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Fungsi styling badge dinamis
  const getBadgeStyle = (type) => {
    switch(type) {
      case "Laporan Sampah": return "bg-red-50 text-red-600 ring-red-500/20";
      case "Aset": return "bg-emerald-50 text-emerald-600 ring-emerald-500/20";
      case "Kolaborator": return "bg-blue-50 text-blue-600 ring-blue-500/20";
      case "Barang Daur Ulang": return "bg-amber-50 text-amber-600 ring-amber-500/20";
      default: return "bg-gray-50 text-gray-600 ring-gray-500/20";
    }
  };

  return (
    <aside className="hidden w-80 shrink-0 flex-col border-r border-gray-200 bg-white shadow-[4px_0_24px_rgb(0,0,0,0.02)] md:flex z-10">
      
      {/* Header & Filter */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-extrabold text-gray-900 mb-1">Peta Torang Bersih</h1>
        <p className="mb-6 text-xs font-medium text-gray-500">Cari titik pengelolaan sampah terdekat.</p>

        <h2 className="mb-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase">Filter Kategori</h2>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat} className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={filters.includes(cat)}
                  onChange={() => handleFilterChange(cat)}
                  className="peer size-5 cursor-pointer appearance-none rounded border-2 border-gray-300 checked:border-(--primary) checked:bg-(--primary) transition-all"
                />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* List Hasil Pencarian */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 scrollbar-hide">
        <p className="text-xs font-bold text-gray-400 mb-3 px-1">{locations.length} Lokasi ditemukan</p>
        <div className="flex flex-col gap-3">
          {locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => onCardClick(loc)}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-(--primary) hover:shadow-md active:scale-95"
            >
              <span className={`inline-block rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getBadgeStyle(loc.type)}`}>
                {loc.type}
              </span>
              <h4 className="mt-2 text-sm font-bold text-gray-900 leading-snug">{loc.name}</h4>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {loc.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarPeta;