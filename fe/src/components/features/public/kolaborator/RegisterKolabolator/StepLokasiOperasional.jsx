import React, { useState } from "react";

// ─── Validasi ─────────────────────────────────────────────────────
const RULES = {
  alamat_lengkap: { minLength: 10, maxLength: 200 },
  gmaps_url: {
    // Menerima semua format link Google Maps yang umum
    pattern: /^https:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|www\.google\.com\/maps|maps\.google\.com)/,
    patternMsg: "Link harus dari Google Maps. Cth: https://maps.app.goo.gl/xxx atau https://www.google.com/maps/...",
  },
};

const validate = (name, value) => {
  if (!value?.trim()) return "Wajib diisi.";
  const r = RULES[name];
  if (!r) return null;
  if (r.minLength && value.trim().length < r.minLength) return `Minimal ${r.minLength} karakter.`;
  if (r.maxLength && value.trim().length > r.maxLength) return `Maksimal ${r.maxLength} karakter.`;
  if (r.pattern && !r.pattern.test(value.trim())) return r.patternMsg;
  return null;
};

// Ekstrak koordinat dari URL Google Maps jika bisa (opsional, nice-to-have)
const extractCoordsFromGmaps = (url) => {
  try {
    // Format: @lat,lng,zoom atau ll=lat,lng
    const atMatch  = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const llMatch  = url.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    const match    = atMatch || llMatch;
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    return null;
  } catch {
    return null;
  }
};

const inputClass = (touched, error) => {
  const base = "w-full rounded border px-4 py-2.5 text-sm focus:outline-none transition-colors";
  if (!touched) return `${base} border-gray-300 focus:border-[#1e1f78]`;
  if (error)    return `${base} border-red-400 bg-red-50 focus:border-red-500`;
  return          `${base} border-green-400 bg-green-50 focus:border-green-500`;
};

const ErrorMsg = ({ msg }) => msg ? (
  <p className="mt-1 flex items-center gap-1 text-[12px] text-red-500">
    <svg className="size-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
    {msg}
  </p>
) : null;

// ══════════════════════════════════════════════════════════════════
const StepLokasiOperasional = ({ formData, handleChange, setFormData }) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors]   = useState({});
  const [gmapsPreview, setGmapsPreview] = useState(null); // koordinat hasil ekstrak (opsional)

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleLocalChange = (e) => {
    handleChange(e);
    const { name, value } = e.target;
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));

    // Coba ekstrak koordinat dari URL Google Maps secara otomatis
    if (name === "gmaps_url") {
      const coords = extractCoordsFromGmaps(value);
      if (coords) {
        setGmapsPreview(coords);
        setFormData((prev) => ({ ...prev, latitude: coords.lat, longitude: coords.lng }));
      } else {
        setGmapsPreview(null);
      }
    }
  };

  const isValid = (name) => touched[name] && !errors[name] && formData[name];

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <h2 className="mb-8 text-[22px] font-bold text-gray-900">Lokasi & Operasional</h2>

      {/* Kota / Kabupaten */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Pilih Kota/Kabupaten operasional Anda.
        </label>
        <select name="kabupaten_kota" value={formData.kabupaten_kota}
          onChange={handleLocalChange} onBlur={handleBlur}
          className={`${inputClass(touched.kabupaten_kota, errors.kabupaten_kota)} text-gray-600`}>
          <option value="" disabled>-- Kota/Kabupaten --</option>
          <option value="Kota Manado">Kota Manado</option>
          <option value="Kota Bitung">Kota Bitung</option>
          <option value="Kota Tomohon">Kota Tomohon</option>
          <option value="Kabupaten Minahasa">Kabupaten Minahasa</option>
          <option value="Kabupaten Minahasa Utara">Kabupaten Minahasa Utara</option>
        </select>
        <ErrorMsg msg={touched.kabupaten_kota ? errors.kabupaten_kota : null} />
      </div>

      {/* Alamat Lengkap */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Alamat lengkap
        </label>
        <input
          type="text"
          name="alamat_lengkap"
          value={formData.alamat_lengkap}
          onChange={handleLocalChange}
          onBlur={handleBlur}
          placeholder="Cth: Jl. Sam Ratulangi No. 12, Kel. Wenang, Manado"
          maxLength={200}
          className={inputClass(touched.alamat_lengkap, errors.alamat_lengkap)}
        />
        {touched.alamat_lengkap && errors.alamat_lengkap
          ? <ErrorMsg msg={errors.alamat_lengkap} />
          : <p className="mt-1 text-right text-[11px] text-gray-400">
              {formData.alamat_lengkap.length}/200
            </p>
        }
      </div>

      {/* Link Google Maps */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Link Google Maps
        </label>

        {/* Panduan cara dapat link */}
        <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="mb-2 text-[12px] font-bold text-gray-700">Cara mendapatkan link:</p>
          <ol className="space-y-1 text-[12px] text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#1e1f78] text-[10px] font-bold text-white">1</span>
              Buka <span className="font-semibold text-[#1e1f78]">Google Maps</span> di HP atau browser
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#1e1f78] text-[10px] font-bold text-white">2</span>
              Cari atau tahan lama (long press) di lokasi Anda
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#1e1f78] text-[10px] font-bold text-white">3</span>
              Tap <span className="font-semibold">"Bagikan"</span> → <span className="font-semibold">"Salin link"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#1e1f78] text-[10px] font-bold text-white">4</span>
              Tempel (paste) link di kolom di bawah
            </li>
          </ol>
        </div>

        <div className="relative">
          {/* Ikon Google Maps */}
          <svg className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <input
            type="url"
            name="gmaps_url"
            value={formData.gmaps_url || ""}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            placeholder="https://maps.app.goo.gl/..."
            className={`${inputClass(touched.gmaps_url, errors.gmaps_url)} pl-9 pr-8`}
          />
          {/* Ikon centang jika valid */}
          {isValid("gmaps_url") && (
            <svg className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
        <ErrorMsg msg={touched.gmaps_url ? errors.gmaps_url : null} />

        {/* Preview: koordinat berhasil diekstrak dari URL panjang */}
        {gmapsPreview && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
            <svg className="size-4 shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p className="text-[11px] text-green-700">
              Koordinat terdeteksi otomatis:
              <span className="ml-1 font-mono font-semibold">
                {gmapsPreview.lat.toFixed(6)}, {gmapsPreview.lng.toFixed(6)}
              </span>
            </p>
          </div>
        )}

        {/* Info: link pendek goo.gl tidak bisa diekstrak koordinatnya */}
        {isValid("gmaps_url") && !gmapsPreview && (
          <p className="mt-2 text-[11px] text-gray-400">
            Link tersimpan. Koordinat tidak bisa diekstrak otomatis dari link pendek — tidak masalah, link saja sudah cukup.
          </p>
        )}
      </div>
    </div>
  );
};

export default StepLokasiOperasional;