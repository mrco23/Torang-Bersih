import L from "leaflet";

// ── Shared marker icon ─────────────────────────────────────────────
export const markerIcon = new L.divIcon({
  className: "bg-transparent",
  html: `<div class="relative flex items-center justify-center size-8">
      <div class="absolute size-full bg-blue-600 rounded-full animate-ping opacity-30"></div>
      <div class="relative size-5 bg-blue-600 border-2 border-white rounded-full shadow-lg z-10"></div>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export const DEFAULT_LAT = 1.4748;
export const DEFAULT_LNG = 124.8421;

// ── Geocoding helpers ──────────────────────────────────────────────
export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { "Accept-Language": "id" } },
    );
    const data = await res.json();
    if (data?.address) {
      const a = data.address;
      return {
        kabupaten_kota:
          a.city ||
          a.county ||
          a.town ||
          a.municipality ||
          a.state_district ||
          "",
        alamat_lengkap: data.display_name || "",
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const forwardGeocode = async (query) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`,
      { headers: { "Accept-Language": "id" } },
    );
    const data = await res.json();
    if (data?.length > 0) {
      const r = data[0];
      const a = r.address || {};
      return {
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        kabupaten_kota:
          a.city ||
          a.county ||
          a.town ||
          a.municipality ||
          a.state_district ||
          "",
        alamat_lengkap: r.display_name || query,
      };
    }
    return null;
  } catch {
    return null;
  }
};
