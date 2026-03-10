import React, { useState } from "react";

const KECAMATAN_MAP = {
  "Kota Manado":           ["Malalayang","Sario","Wanea","Wenang","Tikala","Paal Dua","Mapanget","Singkil","Tuminting","Bunaken","Bunaken Kepulauan"],
  "Kota Bitung":           ["Madidir","Matuari","Girian","Lembeh Selatan","Lembeh Utara","Aertembaga","Maesa","Ranowulu"],
  "Kota Tomohon":          ["Tomohon Utara","Tomohon Tengah","Tomohon Selatan","Tomohon Barat","Tomohon Timur"],
  "Kabupaten Minahasa":    ["Kawangkoan","Kawangkoan Barat","Kawangkoan Utara","Sonder","Langowan Barat","Langowan Timur","Langowan Selatan","Langowan Utara","Tondano Barat","Tondano Timur","Tondano Selatan","Tondano Utara","Remboken","Kakas","Kakas Barat","Eris","Kombi","Lembean Timur","Tombulu","Pineleng","Tombariri","Tombariri Timur"],
  "Kabupaten Minahasa Utara": ["Airmadidi","Kauditan","Kema","Likupang Barat","Likupang Timur","Likupang Selatan","Kalawat","Dimembe","Talawaan","Wori"],
};

const RULES = {
  alamat_lengkap: { minLength: 10, maxLength: 200 },
  gmaps_url: {
    pattern: /^https:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|www\.google\.com\/maps|maps\.google\.com)/,
    patternMsg: "Link harus dari Google Maps.",
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

const StepLokasiAset = ({ formData, handleChange }) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors]   = useState({});

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleLocal = (e) => {
    handleChange(e);
    const { name, value } = e.target;
    if (touched[name]) setErrors((p) => ({ ...p, [name]: validate(name, value) }));
    // Reset kecamatan jika kabupaten berubah
    if (name === "kabupaten_kota") {
      handleChange({ target: { name: "kecamatan", value: "" } });
    }
  };

  const isValid = (name) => touched[name] && !errors[name] && formData[name];
  const kecList = KECAMATAN_MAP[formData.kabupaten_kota] || [];

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <h2 className="mb-6 text-[22px] font-bold text-gray-900">Lokasi Aset</h2>

      {/* Kabupaten/Kota */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">Kota / Kabupaten</label>
        <select name="kabupaten_kota" value={formData.kabupaten_kota}
          onChange={handleLocal} onBlur={handleBlur}
          className={`${inputClass(touched.kabupaten_kota, errors.kabupaten_kota)} text-gray-600`}>
          <option value="" disabled>-- Pilih Kota/Kabupaten --</option>
          {Object.keys(KECAMATAN_MAP).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <ErrorMsg msg={touched.kabupaten_kota ? errors.kabupaten_kota : null} />
      </div>

      {/* Kecamatan */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">Kecamatan</label>
        <select name="kecamatan" value={formData.kecamatan}
          onChange={handleLocal} onBlur={handleBlur}
          disabled={!formData.kabupaten_kota}
          className={`${inputClass(touched.kecamatan, errors.kecamatan)} text-gray-600 disabled:cursor-not-allowed disabled:opacity-50`}>
          <option value="" disabled>
            {formData.kabupaten_kota ? "-- Pilih Kecamatan --" : "-- Pilih Kota/Kabupaten dulu --"}
          </option>
          {kecList.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <ErrorMsg msg={touched.kecamatan ? errors.kecamatan : null} />
      </div>

      {/* Alamat */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">Alamat Lengkap</label>
        <input type="text" name="alamat_lengkap" value={formData.alamat_lengkap}
          onChange={handleLocal} onBlur={handleBlur}
          placeholder="Cth: Jl. Veteran No. 5, Kel. Tikala Ares" maxLength={200}
          className={inputClass(touched.alamat_lengkap, errors.alamat_lengkap)} />
        {touched.alamat_lengkap && errors.alamat_lengkap
          ? <ErrorMsg msg={errors.alamat_lengkap} />
          : <p className="mt-1 text-right text-[11px] text-gray-400">{formData.alamat_lengkap.length}/200</p>}
      </div>

      {/* Google Maps */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">Link Google Maps</label>
        <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="mb-2 text-[12px] font-bold text-gray-700">Cara mendapatkan link:</p>
          <ol className="space-y-1 text-[12px] text-gray-600">
            {["Buka Google Maps di HP atau browser","Cari atau tahan lama di lokasi aset","Tap \"Bagikan\" → \"Salin link\"","Tempel link di kolom di bawah"].map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#1e1f78] text-[10px] font-bold text-white">{i+1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div className="relative">
          <svg className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <input type="url" name="gmaps_url" value={formData.gmaps_url}
            onChange={handleLocal} onBlur={handleBlur}
            placeholder="https://maps.app.goo.gl/..."
            className={`${inputClass(touched.gmaps_url, errors.gmaps_url)} pl-9 pr-8`} />
          {isValid("gmaps_url") && (
            <svg className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
        <ErrorMsg msg={touched.gmaps_url ? errors.gmaps_url : null} />
      </div>
    </div>
  );
};

export default StepLokasiAset;