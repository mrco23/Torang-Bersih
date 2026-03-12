import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { RiWhatsappLine } from "react-icons/ri";
import { inputCls } from "./Constant";

// Custom marker icon
const markerIcon = new L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="relative flex items-center justify-center size-10">
      <div class="absolute size-full bg-[#1e1f78] rounded-full animate-ping opacity-30"></div>
      <div class="relative size-6 bg-[#1e1f78] border-[3px] border-white rounded-full shadow-lg z-10"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Map click handler
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Pan map to new position
function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1 });
    }
  }, [center, map]);
  return null;
}

// Reverse geocoding (lat/lng → address)
const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { "Accept-Language": "id" } },
    );
    const data = await res.json();
    if (data && data.address) {
      const addr = data.address;
      const kabKota =
        addr.city ||
        addr.county ||
        addr.town ||
        addr.municipality ||
        addr.state_district ||
        "";
      const alamat = data.display_name || "";
      return { kabupaten_kota: kabKota, alamat_lengkap: alamat };
    }
    return null;
  } catch {
    return null;
  }
};

// Forward geocoding (address → lat/lng)
const forwardGeocode = async (query) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`,
      { headers: { "Accept-Language": "id" } },
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const result = data[0];
      const addr = result.address || {};
      const kabKota =
        addr.city ||
        addr.county ||
        addr.town ||
        addr.municipality ||
        addr.state_district ||
        "";
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        kabupaten_kota: kabKota,
        alamat_lengkap: result.display_name || query,
      };
    }
    return null;
  } catch {
    return null;
  }
};

const Label = ({ children, req }) => (
  <p className="mb-1.5 text-[12px] font-bold text-gray-700">
    {children}
    {req && <span className="ml-0.5 text-red-400">*</span>}
  </p>
);

export const StepLokasi = ({ form, setForm }) => {
  const [geocoding, setGeocoding] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState(null);
  const [kontakError, setKontakError] = useState("");

  const hasMarker = form.latitude && form.longitude;

  // Klik peta → set marker + reverse geocode
  const handleMapClick = async (lat, lng) => {
    setForm((p) => ({ ...p, latitude: lat, longitude: lng }));
    setGeocoding(true);
    const result = await reverseGeocode(lat, lng);
    if (result) {
      setForm((p) => ({
        ...p,
        kabupaten_kota: result.kabupaten_kota,
        alamat_lengkap: result.alamat_lengkap,
      }));
    }
    setGeocoding(false);
  };

  // GPS → geolocation + reverse geocode
  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((p) => ({ ...p, latitude, longitude }));
        setMapCenter([latitude, longitude]);

        setGeocoding(true);
        const result = await reverseGeocode(latitude, longitude);
        if (result) {
          setForm((p) => ({
            ...p,
            kabupaten_kota: result.kabupaten_kota,
            alamat_lengkap: result.alamat_lengkap,
          }));
        }
        setGeocoding(false);
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Search alamat → forward geocode
  const handleSearchAddress = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setGeocoding(true);
    const result = await forwardGeocode(searchQuery);
    if (result) {
      setForm((p) => ({
        ...p,
        latitude: result.latitude,
        longitude: result.longitude,
        kabupaten_kota: result.kabupaten_kota,
        alamat_lengkap: result.alamat_lengkap,
      }));
      setMapCenter([result.latitude, result.longitude]);
    }
    setGeocoding(false);
  };

  const handleKontak = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setForm((p) => ({ ...p, kontak: val }));
    if (val && val.length < 9) setKontakError("Nomor WA minimal 9 digit");
    else setKontakError("");
  };

  return (
    <div className="flex h-full gap-6">
      <div className="flex h-full w-1/2 flex-col gap-4">
        {/* Cari lokasi */}
        <div className="shrink-0">
          <Label>Cari lokasi di peta</Label>
          <form onSubmit={handleSearchAddress} className="flex gap-2">
            <div className="relative flex-1">
              <svg
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cth: Pasar Bersehati Manado"
                className={`${inputCls} pl-9`}
              />
            </div>
            <button
              type="submit"
              disabled={geocoding}
              className="shrink-0 rounded-xl bg-[#1e1f78] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#16175e] disabled:opacity-50"
            >
              {geocoding ? "..." : "Cari"}
            </button>
          </form>
        </div>

        {/* Peta */}
        <div className="flex min-h-0 flex-1 flex-col">
          <Label>Tandai Peta Lokasi COD</Label>
          <div className="flex h-full flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
            <div className="relative flex-1">
              <MapContainer
                center={[form.latitude || 1.4748, form.longitude || 124.8421]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler onMapClick={handleMapClick} />
                {mapCenter && <MapCenterUpdater center={mapCenter} />}
                {hasMarker && (
                  <Marker
                    position={[form.latitude, form.longitude]}
                    icon={markerIcon}
                  />
                )}
              </MapContainer>

              {/* GPS Button */}
              <button
                type="button"
                onClick={handleGPS}
                disabled={gpsLoading}
                className="absolute right-3 bottom-3 z-1000 flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[12px] font-bold text-gray-700 shadow-md ring-1 ring-gray-900/10 transition hover:bg-gray-50 active:scale-95 disabled:opacity-50"
              >
                {gpsLoading ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-[#1e1f78] border-t-transparent" />
                ) : (
                  <svg
                    className="size-4 text-[#1e1f78]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 2a1 1 0 011 1v2.07A7.003 7.003 0 0118.93 11H21a1 1 0 110 2h-2.07A7.003 7.003 0 0113 18.93V21a1 1 0 11-2 0v-2.07A7.003 7.003 0 015.07 13H3a1 1 0 110-2h2.07A7.003 7.003 0 0111 5.07V3a1 1 0 011-1zm0 5a5 5 0 100 10 5 5 0 000-10z"
                    />
                  </svg>
                )}
                {gpsLoading ? "Mendeteksi..." : "Gunakan GPS"}
              </button>
            </div>

            {/* Koordinat preview */}
            <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-gray-200 bg-white p-2.5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                  Koordinat Pin
                </span>
                <span className="font-mono text-[11px] font-bold text-[#1e1f78]">
                  {hasMarker
                    ? `${form.latitude.toFixed(5)}, ${form.longitude.toFixed(5)}`
                    : "Belum ditentukan"}
                </span>
              </div>
              {geocoding && (
                <span className="text-[11px] font-medium text-[#1e1f78]">
                  Mengambil alamat...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-1/2 flex-col gap-4">
        {/* Alamat Lengkap */}
        <div>
          <Label req>Alamat Lengkap / Patokan COD</Label>
          <textarea
            rows={2}
            placeholder="Terisi otomatis dari peta, atau ketik manual"
            value={form.alamat_lengkap || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, alamat_lengkap: e.target.value }))
            }
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Kab/Kota (auto-filled) */}
        <div>
          <Label>Kota / Kabupaten</Label>
          <input
            type="text"
            placeholder="Terisi otomatis dari peta, atau ketik manual"
            value={form.kabupaten_kota || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, kabupaten_kota: e.target.value }))
            }
            className={inputCls}
          />
        </div>

        {/* Kontak (WhatsApp) */}
        <div>
          <Label req>Nomor WhatsApp</Label>
          <div className="relative">
            <div className="absolute top-0 left-0 flex h-full items-center rounded-l-xl border-y border-l border-gray-200 bg-gray-50 px-3.5">
              <RiWhatsappLine size={16} className="text-emerald-500" />
            </div>
            <input
              type="tel"
              placeholder="08xxxxx"
              value={form.kontak || ""}
              onChange={handleKontak}
              className={`${inputCls} pl-14 ${kontakError ? "border-red-400 bg-red-50 focus:border-red-500" : ""}`}
            />
          </div>
          {kontakError && (
            <p className="mt-1 text-[11px] text-red-500">{kontakError}</p>
          )}
        </div>
      </div>
    </div>
  );
};
