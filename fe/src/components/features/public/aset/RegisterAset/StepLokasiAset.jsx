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

// Custom marker icon in Emerald
const markerIcon = new L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="relative flex items-center justify-center size-10">
      <div class="absolute size-full bg-emerald-600 rounded-full animate-ping opacity-30"></div>
      <div class="relative size-6 bg-emerald-600 border-[3px] border-white rounded-full shadow-lg z-10"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// ─── Validasi ─────────────────────────────────────────────────────
const RULES = {
  alamat_lengkap: { minLength: 10, maxLength: 200 },
};

const validate = (name, value) => {
  if (!value?.trim()) return "Wajib diisi.";
  const r = RULES[name];
  if (!r) return null;
  if (r.minLength && value.trim().length < r.minLength)
    return `Minimal ${r.minLength} karakter.`;
  if (r.maxLength && value.trim().length > r.maxLength)
    return `Maksimal ${r.maxLength} karakter.`;
  return null;
};

const inputClass = (touched, error) => {
  const base =
    "w-full rounded border px-4 py-2.5 text-sm focus:outline-none transition-colors";
  if (!touched) return `${base} border-gray-300 focus:border-emerald-600`;
  if (error) return `${base} border-red-400 bg-red-50 focus:border-red-500`;
  return `${base} border-green-400 bg-green-50 focus:border-green-500`;
};

const ErrorMsg = ({ msg }) =>
  msg ? (
    <p className="mt-1 flex items-center gap-1 text-[12px] text-red-500">
      <svg className="size-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {msg}
    </p>
  ) : null;

// ── Map click handler ──────────────────────────────────────────────
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ── Pan map to new position ─────────────────────────────────────────
function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1 });
    }
  }, [center, map]);
  return null;
}

// ── Reverse geocoding (lat/lng → address) ──────────────────────────
const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { "Accept-Language": "id" } }
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

// ── Forward geocoding (address → lat/lng) ──────────────────────────
const forwardGeocode = async (query) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`,
      { headers: { "Accept-Language": "id" } }
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

// ══════════════════════════════════════════════════════════════════
const StepLokasiAset = ({ formData, handleChange }) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [geocoding, setGeocoding] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState(null);

  const hasMarker = formData.latitude && formData.longitude;

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleLocalChange = (e) => {
    handleChange(e);
    const { name, value } = e.target;
    if (touched[name])
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  // ── Klik peta → set marker + reverse geocode ─────────────────────
  const handleMapClick = async (lat, lng) => {
    handleChange({ target: { name: "latitude", value: lat } });
    handleChange({ target: { name: "longitude", value: lng } });
    
    setGeocoding(true);
    const result = await reverseGeocode(lat, lng);
    if (result) {
      handleChange({ target: { name: "kabupaten_kota", value: result.kabupaten_kota } });
      handleChange({ target: { name: "alamat_lengkap", value: result.alamat_lengkap } });
    }
    setGeocoding(false);
  };

  // ── GPS → geolocation + reverse geocode ──────────────────────────
  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        handleChange({ target: { name: "latitude", value: latitude } });
        handleChange({ target: { name: "longitude", value: longitude } });
        setMapCenter([latitude, longitude]);
        
        setGeocoding(true);
        const result = await reverseGeocode(latitude, longitude);
        if (result) {
          handleChange({ target: { name: "kabupaten_kota", value: result.kabupaten_kota } });
          handleChange({ target: { name: "alamat_lengkap", value: result.alamat_lengkap } });
        }
        setGeocoding(false);
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ── Search alamat → forward geocode ──────────────────────────────
  const handleSearchAddress = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setGeocoding(true);
    const result = await forwardGeocode(searchQuery);
    if (result) {
      handleChange({ target: { name: "latitude", value: result.latitude } });
      handleChange({ target: { name: "longitude", value: result.longitude } });
      handleChange({ target: { name: "kabupaten_kota", value: result.kabupaten_kota } });
      handleChange({ target: { name: "alamat_lengkap", value: result.alamat_lengkap } });
      setMapCenter([result.latitude, result.longitude]);
    }
    setGeocoding(false);
  };

  return (
    <div className="animate-in fade-in space-y-5 duration-300">
      <h2 className="mb-6 text-[22px] font-bold text-gray-900">
        Titik Lokasi Aset
      </h2>

      {/* Cari Alamat */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Cari lokasi di peta
        </label>
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
              placeholder="Cth: TPA Sumompo"
              className="w-full rounded border border-gray-300 py-2.5 pr-4 pl-9 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={geocoding}
            className="shrink-0 rounded bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {geocoding ? "..." : "Cari"}
          </button>
        </form>
      </div>

      {/* Peta Leaflet */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="relative z-0 h-[260px] bg-gray-100">
          <MapContainer
            center={[
              formData.latitude || 1.4748,
              formData.longitude || 124.8421,
            ]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onMapClick={handleMapClick} />
            {mapCenter && <MapCenterUpdater center={mapCenter} />}
            {hasMarker && (
              <Marker
                position={[formData.latitude, formData.longitude]}
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
              <div className="size-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            ) : (
              <svg
                className="size-4 text-emerald-600"
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
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2">
          <p className="text-[11px] text-gray-500">
            {hasMarker ? (
              <>
                <span className="font-semibold text-gray-700">Koordinat:</span>{" "}
                <span className="font-mono">
                  {formData.latitude.toFixed(6)},{" "}
                  {formData.longitude.toFixed(6)}
                </span>
              </>
            ) : (
              "Klik pada peta atau gunakan GPS untuk menandai lokasi aset"
            )}
          </p>
          {geocoding && (
            <span className="text-[11px] font-medium text-emerald-600">
              Mengambil alamat...
            </span>
          )}
        </div>
      </div>

      {/* Kota / Kabupaten */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Kota / Kabupaten
        </label>
        <input
          type="text"
          name="kabupaten_kota"
          value={formData.kabupaten_kota}
          onChange={handleLocalChange}
          onBlur={handleBlur}
          placeholder="Terisi otomatis dari peta, atau ketik manual"
          className={inputClass(touched.kabupaten_kota, errors.kabupaten_kota)}
        />
        <ErrorMsg msg={touched.kabupaten_kota ? errors.kabupaten_kota : null} />
      </div>

      {/* Alamat Lengkap */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Alamat Lengkap
        </label>
        <input
          type="text"
          name="alamat_lengkap"
          value={formData.alamat_lengkap}
          onChange={handleLocalChange}
          onBlur={handleBlur}
          placeholder="Terisi otomatis dari peta, atau ketik manual"
          maxLength={200}
          className={inputClass(touched.alamat_lengkap, errors.alamat_lengkap)}
        />
        {touched.alamat_lengkap && errors.alamat_lengkap ? (
          <ErrorMsg msg={errors.alamat_lengkap} />
        ) : (
          <p className="mt-1 text-right text-[11px] text-gray-400">
            {formData.alamat_lengkap.length}/200
          </p>
        )}
      </div>
    </div>
  );
};

export default StepLokasiAset;