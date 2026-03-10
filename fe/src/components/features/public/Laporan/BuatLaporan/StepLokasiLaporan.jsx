import React, { useState } from "react";

const GMAPS_PATTERN = /^https:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|www\.google\.com\/maps|maps\.google\.com)/;

const extractCoords = (url) => {
  try {
    const m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    return m ? { lat: parseFloat(m[1]), lng: parseFloat(m[2]) } : null;
  } catch { return null; }
};

const inputCls = (t, e) => {
  const base = "w-full rounded border px-4 py-2.5 text-sm focus:outline-none transition-colors";
  if (!t) return `${base} border-gray-300 focus:border-[#1e1f78]`;
  if (e)  return `${base} border-red-400 bg-red-50 focus:border-red-500`;
  return    `${base} border-green-400 bg-green-50 focus:border-green-500`;
};

const ErrorMsg = ({ msg }) => msg ? (
  <p className="mt-1 flex items-center gap-1 text-[12px] text-red-500">
    <svg className="size-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
    {msg}
  </p>
) : null;

const SuccessIcon = () => (
  <svg className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);

export default function StepLokasiLaporan({ formData, setFormData, handleChange }) {
  const [gpsLoading, setGpsLoading]   = useState(false);
  const [gpsError, setGpsError]       = useState(null);
  const [gmapsPreview, setGmapsPreview] = useState(null);
  const [touched, setTouched]         = useState({});
  const [errors, setErrors]           = useState({});

  const handleBlur = (name, value) => {
    setTouched((p) => ({ ...p, [name]: true }));
    if (!value?.trim()) setErrors((p) => ({ ...p, [name]: "Wajib diisi." }));
    else setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleLocalChange = (e) => {
    handleChange(e);
    const { name, value } = e.target;
    if (touched[name]) {
      setErrors((p) => ({ ...p, [name]: !value?.trim() ? "Wajib diisi." : null }));
    }
    if (name === "gmaps_url") {
      const coords = extractCoords(value);
      if (coords) {
        setGmapsPreview(coords);
        setFormData((p) => ({ ...p, latitude: coords.lat, longitude: coords.lng }));
      } else {
        setGmapsPreview(null);
      }
    }
  };

  // FITUR YANG DISEMPURNAKAN: Auto-Fill Alamat menggunakan OpenStreetMap
  const handleGPS = () => {
    if (!navigator.geolocation) { setGpsError("Browser tidak mendukung GPS."); return; }
    setGpsLoading(true); setGpsError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        
        // 1. Set Koordinat
        setFormData((p) => ({ ...p, latitude: lat, longitude: lng }));
        
        // 2. Translate Koordinat ke Teks Alamat (Reverse Geocoding)
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.display_name) {
            // Gabungkan alamat hasil deteksi dengan deskripsi yang mungkin sudah diketik user
            const detectedAddress = data.display_name;
            setFormData((p) => ({ 
              ...p, 
              alamat_lokasi: p.alamat_lokasi ? `${p.alamat_lokasi} (${detectedAddress})` : detectedAddress 
            }));
            
            // Hilangkan error karena kolom sudah terisi otomatis
            setTouched((p) => ({ ...p, alamat_lokasi: true }));
            setErrors((p) => ({ ...p, alamat_lokasi: null }));
          }
        } catch (error) {
          console.warn("Gagal mendeteksi nama jalan otomatis.", error);
        }

        setGpsLoading(false);
      },
      () => { setGpsError("Gagal mendapat lokasi. Aktifkan izin GPS di browser Anda."); setGpsLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const isGmapsValid = formData.gmaps_url && GMAPS_PATTERN.test(formData.gmaps_url);
  const hasGPS       = formData.latitude && formData.longitude;

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <h2 className="text-[22px] font-bold text-gray-900">Titik Lokasi</h2>
      <p className="text-sm text-gray-500 -mt-4">Tandai lokasi dan tulis patokan agar petugas mudah menemukan.</p>

      {/* GPS Koordinat */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">Koordinat GPS Saat Ini</label>
        <div className={`flex items-center justify-between rounded border px-4 py-3 transition-colors ${hasGPS ? "border-green-400 bg-green-50" : "border-gray-300 bg-gray-50"}`}>
          {hasGPS ? (
            <div className="flex items-center gap-2">
              <svg className="size-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-[13px] font-semibold text-green-700 font-mono">
                {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </span>
            </div>
          ) : (
            <span className="text-[13px] text-gray-400">Belum ada koordinat terdeteksi</span>
          )}
          <button type="button" onClick={handleGPS} disabled={gpsLoading}
            className="flex items-center gap-1.5 rounded bg-[#1e1f78] px-3 py-1.5 text-[12px] font-bold text-white transition-colors hover:bg-[#16175e] shadow-sm disabled:opacity-60">
            {gpsLoading
              ? <><span className="size-3 rounded-full border-2 border-white/40 border-t-white animate-spin"/><span>Mencari...</span></>
              : <><svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06z"/></svg><span>{hasGPS ? "Perbarui Posisi" : "Ambil Lokasi Saya"}</span></>
            }
          </button>
        </div>
        {gpsError && <ErrorMsg msg={gpsError} />}
      </div>

      {/* Alamat / Patokan */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">Detail Patokan Lokasi</label>
        <textarea
          name="alamat_lokasi"
          value={formData.alamat_lokasi || ""}
          onChange={handleLocalChange}
          onBlur={(e) => handleBlur("alamat_lokasi", e.target.value)}
          rows="3"
          maxLength={300}
          placeholder="Cth: Depan SDN 01 Tikala, dekat tiang listrik pojok jalan..."
          className={`${inputCls(touched.alamat_lokasi, errors.alamat_lokasi)} resize-none`}
        />
        {touched.alamat_lokasi && errors.alamat_lokasi
          ? <ErrorMsg msg={errors.alamat_lokasi} />
          : <p className="mt-1 text-right text-[11px] text-gray-400">{(formData.alamat_lokasi || "").length}/300</p>
        }
      </div>

      {/* Baris pemisah visual */}
      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-gray-200"></div>
        <span className="text-[12px] font-semibold text-gray-400">ATAU</span>
        <div className="h-px flex-1 bg-gray-200"></div>
      </div>

      {/* Link Google Maps */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">Link Google Maps (Opsional)</label>
        <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="mb-1.5 text-[12px] font-bold text-gray-700">Cara dapat link jika tidak di lokasi:</p>
          <ol className="space-y-1 text-[12px] text-gray-600">
            {["Buka Aplikasi Google Maps → cari / tahan di lokasi sampah","Tap \"Bagikan\" (Share) → \"Salin link\"","Paste di kolom di bawah ini"].map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-gray-300 text-[10px] font-bold text-gray-700">{i+1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div className="relative">
          <svg className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <input
            type="url" name="gmaps_url" value={formData.gmaps_url || ""}
            onChange={handleLocalChange}
            onBlur={(e) => {
              setTouched((p) => ({ ...p, gmaps_url: true }));
              const val = e.target.value;
              if (val && !GMAPS_PATTERN.test(val)) setErrors((p) => ({ ...p, gmaps_url: "Link harus dari Google Maps." }));
              else setErrors((p) => ({ ...p, gmaps_url: null }));
            }}
            placeholder="https://maps.app.goo.gl/..."
            className={`${inputCls(touched.gmaps_url, errors.gmaps_url)} pl-9 pr-8`}
          />
          {isGmapsValid && <SuccessIcon />}
        </div>
        <ErrorMsg msg={touched.gmaps_url ? errors.gmaps_url : null} />
        {gmapsPreview && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
            <svg className="size-4 shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p className="text-[11px] text-green-700">Koordinat dari link disetel ke: <span className="font-mono font-semibold">{gmapsPreview.lat.toFixed(6)}, {gmapsPreview.lng.toFixed(6)}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}