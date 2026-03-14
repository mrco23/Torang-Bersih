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
} from "../kolaborator/mapUtils";

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

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition";
const labelCls =
  "block mb-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider";

function AsetEditModal({
  data,
  kategoriOptions,
  onClose,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState({
    nama_aset: data.nama_aset || "",
    kategori_aset_id: data.kategori_aset?.id || data.kategori_aset_id || "",
    deskripsi_aset: data.deskripsi_aset || "",
    kabupaten_kota: data.kabupaten_kota || "",
    alamat_lengkap: data.alamat_lengkap || "",
    latitude: data.latitude || "",
    longitude: data.longitude || "",
    penanggung_jawab: data.penanggung_jawab || "",
    kontak: data.kontak || "",
  });

  const [existingPhotos, setExistingPhotos] = useState(data.pictures_urls || []);
  const [fotoAsetFiles, setFotoAsetFiles] = useState([]);
  const [fotoPreviews, setFotoPreviews] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFoto = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const currentTotal = existingPhotos.length + fotoAsetFiles.length;
    if (currentTotal >= 5) {
      alert("Maksimal 5 foto.");
      return;
    }

    const availableSlots = 5 - currentTotal;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const valid = files
      .filter((f) => allowed.includes(f.type) && f.size <= 5 * 1024 * 1024)
      .slice(0, availableSlots);

    if (valid.length) {
      setFotoAsetFiles((prev) => [...prev, ...valid]);
      valid.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFotoPreviews((prev) => [...prev, ev.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingPhoto = (index) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewPhoto = (index) => {
    setFotoAsetFiles((prev) => prev.filter((_, i) => i !== index));
    setFotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!form.nama_aset || !form.kategori_aset_id) return;
    const filesPayload = fotoAsetFiles.length > 0 ? { foto_aset_urls: fotoAsetFiles } : null;
    const finalForm = { ...form, existing_pictures: existingPhotos };
    onSubmit(finalForm, filesPayload);
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
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Edit Aset</h2>
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

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Foto Gallery */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className={labelCls}>Foto Fasilitas Aset</label>
              <span className="text-xs font-medium text-gray-500">
                {existingPhotos.length + fotoAsetFiles.length} / 5 Foto
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {/* Existing Photos */}
              {existingPhotos.map((url, i) => (
                <div key={`existing-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <img src={url} alt="Aset" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(i)}
                    className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-red-500/80 text-white backdrop-blur-sm transition hover:bg-red-600 scale-0 group-hover:scale-100"
                  >
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* New Photos */}
              {fotoPreviews.map((preview, i) => (
                <div key={`new-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50">
                  <img src={preview} alt="Baru" className="size-full object-cover" />
                  <div className="absolute top-1 left-1 rounded bg-emerald-500 px-1.5 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                    Baru
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewPhoto(i)}
                    className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-red-500/80 text-white backdrop-blur-sm transition hover:bg-red-600 scale-0 group-hover:scale-100"
                  >
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add Photo Button */}
              {existingPhotos.length + fotoAsetFiles.length < 5 && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-500"
                >
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Tambah</span>
                </button>
              )}
            </div>
            
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFoto}
              className="hidden"
            />
            <p className="mt-2 text-[11px] text-gray-500">
              Format didukung: JPG, PNG, WEBP. Maksimal 5MB per foto.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Nama Aset / Fasilitas</label>
              <input
                name="nama_aset"
                value={form.nama_aset}
                onChange={handleChange}
                maxLength={200}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Kategori Aset</label>
              <select
                name="kategori_aset_id"
                value={form.kategori_aset_id}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">-- Pilih --</option>
                {kategoriOptions
                  .filter((k) => k.is_active || k.id === form.kategori_aset_id)
                  .map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} {!k.is_active && "(Nonaktif)"}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Deskripsi</label>
            <textarea
              name="deskripsi_aset"
              value={form.deskripsi_aset}
              onChange={handleChange}
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </div>

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
                  className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={geocoding}
                className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
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

                <button
                  type="button"
                  onClick={handleGps}
                  disabled={gpsLoading}
                  className="absolute right-3 bottom-3 z-1000 flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[12px] font-bold text-gray-700 shadow-md ring-1 ring-gray-900/10 transition hover:bg-gray-50 active:scale-95 disabled:opacity-50"
                >
                  {gpsLoading ? "Mendeteksi..." : "GPS"}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2">
                <p className="text-[11px] text-gray-500">
                  {form.latitude && form.longitude ? (
                     `${Number(form.latitude).toFixed(6)}, ${Number(form.longitude).toFixed(6)}`
                  ) : (
                    "Klik pada peta atau gunakan GPS"
                  )}
                </p>
              </div>
            </div>
          </div>

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
              <label className={labelCls}>Nomor WhatsApp</label>
              <input
                name="kontak"
                value={form.kontak}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>
        </div>

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
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-70"
          >
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AsetEditModal;
