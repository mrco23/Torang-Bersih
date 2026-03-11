import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  markerIcon,
  DEFAULT_LAT,
  DEFAULT_LNG,
  reverseGeocode,
  forwardGeocode,
} from "./mapUtils";

// ── Map sub-components ─────────────────────────────────────────────
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1 });
  }, [center, map]);
  return null;
}

// ── Style constants ────────────────────────────────────────────────
const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-(--primary) focus:ring-1 focus:ring-(--primary) focus:outline-none transition";
const labelCls =
  "block mb-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider";

/**
 * Shared edit modal for kolaborator data.
 *
 * Props:
 *  - data: kolaborator object (pre-fill values)
 *  - jenisOptions: array of { id, nama }
 *  - onClose: () => void
 *  - onSubmit: (formData, logoFile) => Promise<void>
 *  - submitting: boolean
 */
function KolaboratorEditModal({
  data,
  jenisOptions,
  onClose,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState({
    nama_organisasi: data.nama_organisasi || "",
    jenis_kolaborator_id:
      data.jenis_kolaborator?.id || data.jenis_kolaborator_id || "",
    deskripsi: data.deskripsi || "",
    kabupaten_kota: data.kabupaten_kota || "",
    alamat_lengkap: data.alamat_lengkap || "",
    latitude: data.latitude || "",
    longitude: data.longitude || "",
    penanggung_jawab: data.penanggung_jawab || "",
    kontak: data.kontak || "",
    email: data.email || "",
    sosmed: data.sosmed || "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(data.logo_url || null);
  const [mapCenter, setMapCenter] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const logoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) return;
    if (file.size > 2 * 1024 * 1024) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.nama_organisasi || !form.jenis_kolaborator_id) return;
    onSubmit(form, logoFile);
  };

  const handleMapClick = async (lat, lng) => {
    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    setGeocoding(true);
    const result = await reverseGeocode(lat, lng);
    if (result) setForm((prev) => ({ ...prev, ...result }));
    setGeocoding(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setGeocoding(true);
    const result = await forwardGeocode(searchQuery);
    if (result) {
      setForm((prev) => ({ ...prev, ...result }));
      setMapCenter([result.latitude, result.longitude]);
    }
    setGeocoding(false);
  };

  const handleGps = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((prev) => ({ ...prev, latitude, longitude }));
        setMapCenter([latitude, longitude]);
        setGeocoding(true);
        const result = await reverseGeocode(latitude, longitude);
        if (result) setForm((prev) => ({ ...prev, ...result }));
        setGeocoding(false);
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Edit Kolaborator</h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Logo */}
          <div className="flex items-center gap-5">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Preview"
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-300">
                  {form.nama_organisasi?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Ganti Logo
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleLogo}
                className="hidden"
              />
              <p className="mt-1 text-[10px] text-gray-400">
                JPG, PNG, WEBP, SVG · Maks. 2MB
              </p>
            </div>
          </div>

          {/* Profil */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Nama Organisasi</label>
              <input
                name="nama_organisasi"
                value={form.nama_organisasi}
                onChange={handleChange}
                maxLength={100}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Jenis Kolaborator</label>
              <select
                name="jenis_kolaborator_id"
                value={form.jenis_kolaborator_id}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">-- Pilih --</option>
                {jenisOptions.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Deskripsi</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              rows={4}
              className={`${inputCls} resize-none`}
            />
            <p className="mt-1 text-right text-[10px] text-gray-400">
              {form.deskripsi.length} karakter
            </p>
          </div>

          {/* ── Lokasi — Interactive Map ── */}
          <div>
            <label className={labelCls}>Lokasi di Peta</label>
            <form onSubmit={handleSearch} className="mb-2 flex gap-2">
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
                  placeholder="Cari alamat..."
                  className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm focus:border-(--primary) focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={geocoding}
                className="shrink-0 rounded-lg bg-(--primary) px-4 py-2 text-sm font-bold text-white transition hover:bg-(--primary-dark) disabled:opacity-50"
              >
                {geocoding ? "..." : "Cari"}
              </button>
            </form>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="relative z-0 h-[220px] bg-gray-100">
                <MapContainer
                  center={[
                    form.latitude || DEFAULT_LAT,
                    form.longitude || DEFAULT_LNG,
                  ]}
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%", zIndex: 0 }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapClickHandler onMapClick={handleMapClick} />
                  {mapCenter && <MapCenterUpdater center={mapCenter} />}
                  {form.latitude && form.longitude && (
                    <Marker
                      position={[form.latitude, form.longitude]}
                      icon={markerIcon}
                    />
                  )}
                </MapContainer>

                {/* GPS Button */}
                <button
                  type="button"
                  onClick={handleGps}
                  disabled={gpsLoading}
                  className="absolute right-3 bottom-3 z-1000 flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[12px] font-bold text-gray-700 shadow-md ring-1 ring-gray-900/10 transition hover:bg-gray-50 active:scale-95 disabled:opacity-50"
                >
                  {gpsLoading ? (
                    <div className="size-4 animate-spin rounded-full border-2 border-(--primary) border-t-transparent" />
                  ) : (
                    <svg
                      className="size-4 text-(--primary)"
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
                  {gpsLoading ? "Mendeteksi..." : "GPS"}
                </button>
              </div>

              {/* Koordinat bar */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2">
                <p className="text-[11px] text-gray-500">
                  {form.latitude && form.longitude ? (
                    <>
                      <span className="font-semibold text-gray-700">
                        Koordinat:
                      </span>{" "}
                      <span className="font-mono">
                        {Number(form.latitude).toFixed(6)},{" "}
                        {Number(form.longitude).toFixed(6)}
                      </span>
                    </>
                  ) : (
                    "Klik pada peta atau gunakan GPS"
                  )}
                </p>
                {geocoding && (
                  <span className="text-[11px] font-medium text-(--primary)">
                    Mengambil alamat...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Kota & Alamat (auto-filled, editable) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Kota / Kabupaten</label>
              <input
                name="kabupaten_kota"
                value={form.kabupaten_kota}
                onChange={handleChange}
                placeholder="Terisi otomatis dari peta"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Alamat Lengkap</label>
              <input
                name="alamat_lengkap"
                value={form.alamat_lengkap}
                onChange={handleChange}
                placeholder="Terisi otomatis dari peta"
                className={inputCls}
              />
            </div>
          </div>

          {/* Kontak */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Penanggung Jawab</label>
              <input
                name="penanggung_jawab"
                value={form.penanggung_jawab}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Kontak (WhatsApp)</label>
              <input
                name="kontak"
                value={form.kontak}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Sosial Media</label>
              <input
                name="sosmed"
                value={form.sosmed}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl bg-gray-100 px-6 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-(--primary) px-6 py-2.5 text-sm font-bold text-white transition hover:bg-(--primary-dark) disabled:opacity-70"
          >
            {submitting && (
              <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default KolaboratorEditModal;
