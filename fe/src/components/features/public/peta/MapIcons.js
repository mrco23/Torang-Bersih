import L from "leaflet";

// Fungsi untuk menghasilkan HTML Marker berdasarkan tipe
const getIconHtml = (type) => {
  let colorClass = "";
  let svgIcon = "";
  let isPulsing = false;

  switch (type) {
    case "Laporan Sampah":
      colorClass = "bg-red-500";
      isPulsing = true; // Laporan darurat akan berkedip
      svgIcon = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
      break;
    case "Aset":
      colorClass = "bg-emerald-500";
      svgIcon = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`;
      break;
    case "Kolaborator":
      colorClass = "bg-blue-600";
      svgIcon = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`;
      break;
    case "Barang Daur Ulang":
      colorClass = "bg-amber-500";
      svgIcon = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`;
      break;
    default:
      colorClass = "bg-gray-800";
      svgIcon = `<div class="w-2 h-2 bg-white rounded-full"></div>`;
  }

  return `
    <div class="relative flex items-center justify-center w-10 h-10">
      ${isPulsing ? `<div class="absolute w-full h-full ${colorClass} rounded-full animate-ping opacity-40"></div>` : ''}
      <div class="relative flex items-center justify-center w-8 h-8 ${colorClass} border-[3px] border-white rounded-full shadow-md z-10">
        ${svgIcon}
      </div>
      <div class="absolute -bottom-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white z-0"></div>
    </div>
  `;
};

// Fungsi Export yang akan dipanggil di dalam Map
export const getCustomIcon = (type) => {
  return new L.divIcon({
    className: "bg-transparent", // Hilangkan background default leaflet
    html: getIconHtml(type),
    iconSize: [40, 40],
    iconAnchor: [20, 36], // Titik jangkar (bawah tengah)
    popupAnchor: [0, -38],
  });
};